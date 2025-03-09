import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2025-02-24.acacia'
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { data } = await supabase.from('settings').select('value').eq('key', 'paid_post_price').single()
    console.log('data of Price', data)
    
    // Convert the price from database (1499) to cents for Stripe (149900)
    const priceInCents = parseInt(data?.value || '1499') * 100

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'Premium Business Listing',
              description: 'Featured listing for 1 month with enhanced visibility',
            },
            unit_amount: priceInCents, // Using price from database converted to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/list-business?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${request.headers.get('origin')}/list-business?canceled=true`,
      metadata: {
        userId: session.user.id
      },
      customer_email: session.user.email // Pre-fill customer email
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return new NextResponse('Error creating checkout session', { status: 500 })
  }
}
