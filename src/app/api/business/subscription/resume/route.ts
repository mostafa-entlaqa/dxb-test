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

        // Resume subscription in Stripe
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
        })

        // Update in Supabase
        const supabase = getAdminSupabase()
        await supabase
            .from('subscriptions')
            .update({
                cancel_at_period_end: false,
                status: subscription.status,
                updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Resume subscription error:', error)
        return NextResponse.json({ error: 'Failed to resume subscription' }, { status: 500 })
    }
} 