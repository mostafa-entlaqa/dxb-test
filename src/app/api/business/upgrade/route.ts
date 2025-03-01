import { getServerSupabase } from '@/lib/supabase/utils'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-ignore
     apiVersion: '2024-12-18.acacia'
})

export async function POST(request: Request) {
    try {
        const { businessId } = await request.json()
        console.log('Creating checkout session for business:', businessId)

        const supabase = getServerSupabase()

        // Get user session
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('User ID:', user.id)

        // Get business details
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .eq('user_id', user.id)
            .single()

        if (businessError || !business) {
            console.error('Business fetch error:', businessError)
            return NextResponse.json(
                { error: 'Business not found or unauthorized' }, 
                { status: 404 }
            )
        }

        // Check if there's already a paid invoice
        // const { data: existingInvoice, error: invoiceError } = await supabase
        //     .from('invoices')
        //     .select('*')
        //     .eq('business_id', businessId)
        //     .eq('status', 'paid')
        //     .single()

        // if (existingInvoice) {
        //     return NextResponse.json(
        //         { error: 'Business is already upgraded' },
        //         { status: 400 }
        //     )
        // }

        // Get the base URL from the request if environment variable is not set
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                       `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'aed',
                        product_data: {
                            name: 'Business Feature Upgrade',
                            description: `Upgrade for Business #${businessId}`,
                        },
                        unit_amount: 1499 * 100, // 1,499 AED
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/my-listings?success=true`,
            cancel_url: `${baseUrl}/my-listings?canceled=true`,
            metadata: {
                businessId: businessId.toString(),
                user_id: user.id
            },
            customer_email: user.email,
        })

        console.log('Created checkout session:', {
            sessionId: checkoutSession.id,
            businessId: businessId,
            metadata: checkoutSession.metadata
        })

        // Create a pending invoice
        const { data: invoice, error: createInvoiceError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                business_id: parseInt(businessId), // Convert to number since business.id is BIGINT
                amount: 1499,
                currency: 'AED',
                status: 'pending',
                stripe_invoice_id: checkoutSession.id // Store session ID here
            })
            .select()
            .single()

        if (createInvoiceError) {
            console.error('Failed to create invoice:', createInvoiceError)
            return NextResponse.json(
                { error: 'Failed to create invoice' },
                { status: 500 }
            )
        }

        console.log('Created invoice:', invoice)

        return NextResponse.json({
            url: checkoutSession.url,
            sessionId: checkoutSession.id,
            invoice
        })

    } catch (error: any) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' }, 
            { status: 500 }
        )
    }
}
