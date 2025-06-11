import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminSupabase } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
})

export async function POST(request: Request) {
    try {
        const { subscriptionId } = await request.json()
        if (!subscriptionId) {
            return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 })
        }

        // Cancel at period end in Stripe
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        })

        // Update in Supabase
        const supabase = getAdminSupabase()
        await supabase
            .from('subscriptions')
            .update({
                cancel_at_period_end: true,
                status: subscription.status,
                updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Cancel subscription error:', error)
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
    }
} 