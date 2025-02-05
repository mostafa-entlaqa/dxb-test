import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

interface BusinessData {
    id: number
    businessName: string
    businessDescription: string
    category: string
    area: string
    sellingPrice: number
    sellingType: string
    investmentShare?: number
    monthlyRevenue: number
    revenuePerYear: number
    costPerYear: number
    profitMargin: number
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const businessData: BusinessData = await request.json()

    try {
        // Auth check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Construct the prompt
        const prompt = `Analyze the following business opportunity in united Arab emirates from the following:
Business Name: ${businessData.businessName}
Business Description: ${businessData.businessDescription}
Category: ${businessData.category}
Area: ${businessData.area}
Selling Price: ${businessData.sellingPrice}
Selling Type: ${businessData.sellingType}
${businessData.sellingType === 'Investment' ? `Investment Share: ${businessData.investmentShare}%` : ''}
Monthly Revenue: ${businessData.monthlyRevenue}
Revenue Per Year: ${businessData.revenuePerYear}
Cost Per Year: ${businessData.costPerYear}
Profit Margin: ${businessData.profitMargin}%

Provide Feedback as json:
Strength: Percentage (0-40% for not good, 41-70% for potential market needing work, 71-100% for must-catch opportunities)
Deep Analysis: Detailed text including:
- Business overview
- Deal assessment
- Financial analysis
- Market overview
- Standard AI disclaimer for independent verification

Format the response as a valid JSON object with these exact keys: "strength" and "deepAnalysis"`

        // Generate AI response
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        })

        const analysis = JSON.parse(completion.choices[0].message.content || '{}')

        console.log(analysis)
        console.log('businessData.id', businessData.id)
        console.log('user.id', user.id)
        // Store in database
        const { error: insertError } = await supabase
            .from('ai_analysis')
            .insert({
                user_id: user.id,
                business_id: businessData.id, // You might want to use an actual business ID here
                score: parseInt(analysis.strength),
                ai_response: analysis.deepAnalysis,
            })

        if (insertError) {
            console.error('Insert error:', insertError)
            return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 })
        }

        return NextResponse.json(analysis)

    } catch (error) {
        console.error('AI analysis error:', error)
        return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 })
    }
} 