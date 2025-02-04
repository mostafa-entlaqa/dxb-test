import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { businessName, category } = await req.json();

    const titlePrompt = `You are a business listing writer. Transform this real business name into a different, attractive business name. 
The new name should be in a similar category but completely different from the original. 
Real business: ${businessName}
Category: ${category}

Example:
If real business is "Thriving Cafe in Barsha", output could be "Morning Brew Cafe"
Important: Create a NEW name, don't use words from the original name.`;

    const descriptionPrompt = `Create an engaging, lifestyle-focused description (max 140 characters) for a ${category} business. 
Focus on atmosphere, experience, and unique features.

Rules:
- Don't mention price, profits, or business metrics
- Don't reveal the actual business name
- Don't mention specific location or area
- Focus on customer experience, ambiance, and amenities
- Keep it natural and inviting

Example style: "Charming café with modern aesthetics. Cozy corners perfect for morning coffee, business meetings, or afternoon treats. Beautiful terrace seating."`;

    const [titleResponse, descriptionResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: titlePrompt }],
        temperature: 0.7,
        max_tokens: 50
      }),
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: descriptionPrompt }],
        temperature: 0.7,
        max_tokens: 140
      })
    ]);

    return NextResponse.json({
      businessName: titleResponse.choices[0].message.content?.trim(),
      description: descriptionResponse.choices[0].message.content?.trim()
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 