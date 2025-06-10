import { getServerSupabase } from '@/lib/supabase/utils'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
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

        const { data: paidPostPrice, error: paidPostPriceError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'paid_post_price')
            .single()

        console.log('paidPostPrice', paidPostPrice?.value)

        if (paidPostPriceError) {
            console.error('Paid post price fetch error:', paidPostPriceError)
            return NextResponse.json({ error: 'Failed to fetch paid post price' }, { status: 500 })
        }



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
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
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
                        unit_amount: Number(paidPostPrice?.value) * 100, // 1,499 AED
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/my-listings?success=true`,
            cancel_url: `${baseUrl}/my-listings?canceled=true`,
            metadata: {
                businessId: businessId.toString(),
                user_id: user.id,
                payment_type: 'business_upgrade'
            },
            customer_email: user.email,
        })

        console.log('Creating invoice with data:', {
            user_id: user.id,
            business_id: businessId,
            amount: 1499
        })

        // Create a pending invoice
        const { data: invoice, error: createInvoiceError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                amount: 1499,
                currency: 'AED',
                status: 'pending'
            })
            .select()
            .single()

        if (createInvoiceError) {
            console.error('Detailed invoice creation error:', {
                error: createInvoiceError,
                code: createInvoiceError.code,
                details: createInvoiceError.details,
                hint: createInvoiceError.hint,
                message: createInvoiceError.message
            })
            return NextResponse.json(
                { error: `Failed to create invoice: ${createInvoiceError.message}` },
                { status: 500 }
            )
        }

        console.log('Invoice created successfully:', invoice)

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

        return NextResponse.json({
            url: checkoutSession.url,
            sessionId: checkoutSession.id,
            invoice
        })

    } catch (error: any) {
        console.error('Checkout session error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
