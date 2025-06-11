/*
-- SQL to insert dummy subscription plan
-- First, create a product and price in Stripe dashboard and copy their IDs
-- Then run this SQL:

INSERT INTO subscription_plans (
    name,
    description,
    stripe_price_id,
    stripe_product_id,
    price_amount,
    interval,
    features,
    created_at
) VALUES (
    'Business Subscription',
    'Monthly subscription for business credits',
    'price_1RYjuOPMZMLGISMK123456789', -- Replace with your Stripe price ID
    'prod_1RYjuOPMZMLGISMK123456789',  -- Replace with your Stripe product ID
    1499,
    'month',
    ARRAY['20 Unlock Credits', '20 AI Credits', 'Monthly Renewal', 'Cancel Anytime'],
    NOW()
);

-- To verify the insert:
SELECT * FROM subscription_plans;

-- To delete if needed:
-- DELETE FROM subscription_plans;
*/

import { getServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
    try {
        const supabase = getServerSupabase()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.error('No session found')
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-02-24.acacia'
        })

        // Debug: First check what plans exist
        const { data: allPlans, error: listError } = await supabase
            .from('subscription_plans')
            .select('*')

        console.log('All subscription plans:', allPlans)
        if (listError) {
            console.error('Error listing plans:', listError)
        }

        // Get the subscription plan
        const { data: plan, error: planError } = await supabase
            .from('subscription_plans')
            .select('*')
            .limit(1)  // Try to get just one plan
            .maybeSingle()  // Use maybeSingle instead of single

        console.log('Found plan:', plan)
        console.log('Plan error:', planError)

        if (planError) {
            console.error('Error fetching subscription plan:', planError)
            return NextResponse.json(
                { error: 'Subscription plan not found', details: planError },
                { status: 404 }
            )
        }

        if (!plan) {
            console.error('No subscription plan found in database')
            return NextResponse.json(
                { error: 'No subscription plan configured' },
                { status: 404 }
            )
        }

        if (!plan.stripe_price_id) {
            console.error('Subscription plan missing stripe_price_id:', plan)
            return NextResponse.json(
                { error: 'Subscription plan not properly configured' },
                { status: 400 }
            )
        }

        // Check for existing active subscription
        const { data: existingSubscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (subError && subError.code !== 'PGRST116') {
            console.error('Error checking existing subscription:', subError)
            return NextResponse.json(
                { error: 'Failed to check existing subscription' },
                { status: 500 }
            )
        }

        if (existingSubscription) {
            console.log('User already has active subscription:', existingSubscription)
            return NextResponse.json(
                { error: 'User already has an active subscription' },
                { status: 400 }
            )
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_APP_URL not configured')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        console.log('Creating checkout session with plan:', {
            planId: plan.id,
            priceId: plan.stripe_price_id,
            userId: user.id
        })

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.stripe_price_id,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/profile?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/profile?canceled=true`,
            metadata: {
                user_id: user.id,
                payment_type: 'subs_credit'
            },
            subscription_data: {
                metadata: {
                    user_id: user.id
                }
            }
        })

        if (!checkoutSession.url) {
            console.error('No URL returned from Stripe checkout session')
            return NextResponse.json(
                { error: 'Failed to create checkout session URL' },
                { status: 500 }
            )
        }

        console.log('Checkout session created successfully:', {
            sessionId: checkoutSession.id,
            url: checkoutSession.url
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            {
                error: 'Failed to create checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 