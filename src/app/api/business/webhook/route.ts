import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { getUserCredits } from '@/actions/user/profile'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json(
            { error: 'Webhook signature verification failed' }, 
            { status: 400 }
        )
    }

    const supabase = getAdminSupabase()



    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentType = session.metadata?.payment_type
        const userId = session.metadata?.user_id

        try {
            // First verify the invoice exists
            const { data: existingInvoice, error: fetchInvoiceError } = await supabase
                .from('invoices')
                .select('*')
                .eq('stripe_invoice_id', session.id)
                .single()

            if (fetchInvoiceError) {
                console.error('Failed to fetch invoice:', {
                    error: fetchInvoiceError,
                    sessionId: session.id
                })
                throw new Error(`Invoice not found with stripe_invoice_id: ${session.id}`)
            }

            if (existingInvoice.status === 'paid') {
                console.log('Invoice is already paid:', session.id)
                return NextResponse.json({ 
                    success: true,
                    message: 'Payment already processed',
                    invoice: existingInvoice
                })
            }

            // Update invoice status
            const { data: invoice, error: invoiceError } = await supabase
                .from('invoices')
                .update({
                    status: 'paid',
                    stripe_payment_intent_id: session.payment_intent as string,
                    payment_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('stripe_invoice_id', session.id)
                .select()
                .single()

            if (invoiceError || !invoice) {
                throw new Error('Failed to update invoice')
            }

            // Handle different payment types
            if (paymentType === 'buy_credits') {
                // First get current credits
                const currentCredits = await getUserCredits(userId ?? '')
                // if (!creditsError) {
                //     throw new Error('Failed to fetch current credits')
                // }


                    console.log('currentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCreditscurrentCredits', currentCredits)
                // Calculate new credit amounts
                const newCredits = (currentCredits?.credits || 0) + 20
                const newAiCredits = (currentCredits?.ai_credits || 0) + 20

                // Update user credits by incrementing existing values
                const { error: userError } = await supabase
                    .from('users_credits')
                    .update({
                        credits: newCredits,
                        ai_credits: newAiCredits,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId)

                if (userError) {
                    throw new Error('Failed to update user credits')
                }

                console.log('Credits updated successfully:', {
                    userId,
                    previousCredits: currentCredits,
                    newCredits: { credits: newCredits, ai_credits: newAiCredits }
                })
            } else if (paymentType === 'business_upgrade') {
                const businessId = session.metadata?.businessId
                if (!businessId) throw new Error('Business ID not found in metadata')

                // Set expiration date to 30 days from now
                const expirationDate = new Date()
                expirationDate.setDate(expirationDate.getDate() + 30)

                // Update business with featured status
                const { error: businessError } = await supabase
                    .from('businesses')
                    .update({
                        featured: true,
                        subscription_end_date: expirationDate.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', businessId)

                if (businessError) {
                    throw new Error('Failed to update business status')
                }
            }

            return NextResponse.json({ 
                success: true,
                invoice
            })
        } catch (error) {
            console.error('Webhook processing error:', error)
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Webhook processing failed' },
                { status: 500 }
            )
        }
    }

    return NextResponse.json({ received: true })
}
