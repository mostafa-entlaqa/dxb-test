import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getAdminSupabase } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2024-12-18.acacia'
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
        const businessId = session.metadata?.businessId

        // Set expiration date to 1 minute from now for testing
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + 30) // 1 minute subscription

        try {
            console.log('Updating business with expiration:', {
                businessId,
                expirationDate: expirationDate.toISOString()
            })

            // Update business with featured status and expiration date
            const { data: business, error: businessError } = await supabase
                .from('businesses')
                .update({
                    featured: true,
                    subscription_end_date: expirationDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', businessId)
                .select()

            console.log('Business update result:', { business, error: businessError })

            if (businessError) {
                console.error('Business update error:', businessError)
                throw new Error(`Failed to update business: ${businessError.message}`)
            }

            // First verify the invoice exists
            const { data: existingInvoice, error: fetchInvoiceError } = await supabase
                .from('invoices')
                .select('*')
                .eq('stripe_invoice_id', session.id)
                .single()

            if (fetchInvoiceError) {
                console.error('Failed to fetch invoice:', {
                    error: fetchInvoiceError,
                    sessionId: session.id,
                    businessId
                })
                throw new Error(`Invoice not found with stripe_invoice_id: ${session.id}`)
            }

            if (existingInvoice.status === 'paid') {
                console.log('Invoice is already paid:', session.id)
                return NextResponse.json({ 
                    success: true,
                    message: 'Payment already processed',
                    business: business?.[0] || existingInvoice,
                    invoice: existingInvoice
                })
            }

            // Update invoice status using admin client
            // Only use stripe_invoice_id to find the invoice since that's how we created it
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

            console.log('Invoice update result:', { 
                invoice, 
                error: invoiceError,
                stripeInvoiceId: session.id
            })
    
            if (invoiceError) {
                console.error('Invoice update error:', invoiceError)
                throw new Error(`Failed to update invoice: ${invoiceError.message}`)
            }

            if (!invoice) {
                throw new Error('Failed to update invoice: No invoice found')
            }

            console.log('Successfully processed payment:', {
                business: business?.[0] || existingInvoice,
                invoice
            })

            return NextResponse.json({ 
                success: true, 
                business: business?.[0] || existingInvoice,
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
