import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const formData = await request.json()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Insert listing into database
    const { data: listing, error } = await supabase
      .from('listings')
      .insert([
        {
          ...formData,
          user_id: session.user.id,
          status: 'active'
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    // If this was a paid listing, update Stripe session
    if (formData.listingType === 'paid' && formData.stripeSessionId) {
      await stripe.checkout.sessions.expire(formData.stripeSessionId)
      
      // Optionally, add metadata about the listing
      await stripe.checkout.sessions.update(formData.stripeSessionId, {
        metadata: {
          listing_id: listing.id,
          status: 'completed'
        }
      })
    }

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error('Error submitting listing:', error)
    return new NextResponse('Error submitting listing', { status: 500 })
  }
} 