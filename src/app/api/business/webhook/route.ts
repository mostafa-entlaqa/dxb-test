import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getServerSupabase } from "@/lib/supabase/server"

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
        return NextResponse.json(
            { error: 'Webhook signature verification failed' }, 
            { status: 400 }
        )
    }

    const supabase = getServerSupabase()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Webhook received:', {
            type: event.type,
            sessionId: session.id,
            metadata: session.metadata,
            businessId: session.metadata?.businessId,
            user_id: session.metadata?.user_id
        })
     
        try {
            
console.log(" session.metadata?.businessId" ,  session.metadata?.businessId)

            console.log('session.metadata?.user_id', session.metadata?.user_id)


            // Update business status
            const { data: business, error: businessError } = await supabase
                .from('businesses')
                .update({
                    featured: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', session.metadata?.businessId)
                .eq('user_id',session.metadata?.user_id )
                .select()

            console.log('Business update result:', { business, error: businessError })
                console.log('businessError', businessError)
            if (businessError) {
                console.error('Business update error:', businessError)
                return NextResponse.json(
                    { error: 'Failed to update business status' },
                    { status: 500 }
                )
            }
        //     const { data: invoice, error: invoiceError } = await supabase
        //     .from('invoices')
        //     .insert({
        //         status: 'paid',
        //         stripe_payment_intent_id: session.payment_intent as string,
        //         stripe_invoice_id: session.id,
        //         payment_date: new Date().toISOString(),
        //         updated_at: new Date().toISOString()
        //     })
        //     .eq('id', session.id)
        //     .select()
        //     .single()
    
        // console.log('Invoice update result:', { invoice, error: invoiceError })
    
        // if (invoiceError) {
        //     console.error('Invoice update error:', invoiceError)
        //     return NextResponse.json(
        //         { error: 'Failed to update invoice status' },
        //         { status: 500 }
        //     )
        // }

            return NextResponse.json({ success: true, business })
        } catch (error) {
            console.error('Webhook processing error:', error)
            return NextResponse.json(
                { error: 'Webhook processing failed' },
                { status: 500 }
            )
        }
    }

    return NextResponse.json({ received: true })
} 