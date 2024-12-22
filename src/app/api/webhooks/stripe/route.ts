import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
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
      return new NextResponse('Webhook signature verification failed', { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Get user ID from metadata
      const userId = session.metadata?.userId
      if (!userId) {
        throw new Error('No user ID in session metadata')
      }

      // Create invoice record
      const { error: invoiceError } = await supabase.from('invoices').insert({
        user_id: userId,
        business_id: null, // Will be updated when business is created
        amount: session.amount_total! / 100, // Convert from cents to AED
        currency: session.currency?.toUpperCase() || 'AED',
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_invoice_id: session.id,
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError)
        throw invoiceError
      }

      console.log('Payment processed and invoice created for user:', userId)
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Webhook error', { status: 500 })
  }
}
