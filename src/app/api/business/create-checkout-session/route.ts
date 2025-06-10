import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { getServerSupabase } from '@/lib/supabase/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
})

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { price, credits } = body



    // Create a new invoice record
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: session.user.id,
        amount: price,
        currency: 'AED',
        status: 'pending'
      })
      .select()
      .single()

    if (invoiceError) {
      console.error('Detailed invoice creation error:', {
        error: invoiceError,
        code: invoiceError.code,
        details: invoiceError.details,
        hint: invoiceError.hint,
        message: invoiceError.message
      })
      return NextResponse.json(
        { error: `Failed to create invoice: ${invoiceError.message}` },
        { status: 500 }
      )
    }


    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'Business Credits Package',
              description: `${credits.unlock} Unlock Credits + ${credits.aiAnalysis} AI Analysis Credits`,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/buy?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/buy?payment=cancelled`,
      metadata: {
        invoice_id: invoice.id,
        user_id: session.user.id,
        payment_type: 'buy_credits'
      },
    })


    // Update invoice with Stripe session ID
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        stripe_invoice_id: checkoutSession.id
      })
      .eq('id', invoice.id)

    if (updateError) {
      console.error('Failed to update invoice with session ID:', updateError)
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 