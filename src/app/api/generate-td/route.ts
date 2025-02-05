import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Constants and configuration
const MAX_BUSINESS_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 3000;
const MODEL_CONFIG = {
 modelId: 'gpt-3.5-turbo' as const,
 temperature: 0.7,
 maxTokens: 300,
};

// Type definitions
interface BusinessIdentity {
 businessName: string;
 description: string;
}

const BusinessTransformRequestSchema = z.object({
 businessName: z.string().min(1, 'Business name is required'),
 description: z.string().min(1, 'Business description is required'),
});

type BusinessTransformRequest = z.infer<typeof BusinessTransformRequestSchema>;

// System prompt template using tagged template literal
const createSystemPrompt = (params: BusinessTransformRequest) => `
Transform the following business information into a new creative identity:

Original Business Name: ${params.businessName}
Original Business Description: ${params.description}

Requirements:
1. Business Name: 
   - Create a thematically related but distinct name
   - Maximum ${MAX_BUSINESS_NAME_LENGTH} characters
   - No obvious connection to original name

2. Description:
   - Maintain core purpose but present from fresh angle
   - Maximum ${MAX_DESCRIPTION_LENGTH} characters
   - Translate business metrics into descriptive terms:
     * Profit margins: Use terms like "high-margin", "profitable", "cost-effective"
     * Revenue: Use "emerging", "established", "industry-leading"
     * Team size: Use "boutique", "growing team", "enterprise-scale"
   - Focus on value proposition without revealing specific numbers
   - Emphasize market position and business strength

3. Format:
   - Strict JSON format with 'businessName' and 'description' fields
   - No additional formatting or markdown

Guidelines:
- Use qualitative descriptions instead of numerical values
- Professional yet creative tone
- Avoid any trace of original context or specific metrics
- Ensure linguistic diversity in phrasing
- Incorporate modern business terminology
- Present success indicators subtly`;

// Response validation schema
const BusinessIdentitySchema = z.object({
 businessName: z.string().max(MAX_BUSINESS_NAME_LENGTH),
 description: z.string().max(MAX_DESCRIPTION_LENGTH),
});

export async function POST(req: Request) {
 try {
  // Validate request body
  const requestBody = await req.json();
  const validationResult = BusinessTransformRequestSchema.safeParse(requestBody);

  if (!validationResult.success) {
   return Response.json(
    { error: 'Invalid request', details: validationResult.error.errors },
    { status: 400 }
   );
  }

  const { businessName, description } = validationResult.data;

  // Generate AI response
  const { text } = await generateText({
   model: openai(MODEL_CONFIG.modelId),
   system: createSystemPrompt({ businessName, description }),
   temperature: MODEL_CONFIG.temperature,
   prompt: "Generate a creative and professional business name and description for the following business: " + businessName + " " + description,
  });

  // Parse and validate AI response
    const parsedResponse = JSON.parse(text);
    console.log("parsedResponse =>", parsedResponse);
  const identityValidation = BusinessIdentitySchema.safeParse(parsedResponse);
  console.log("identityValidation =>", identityValidation);
  if (!identityValidation.success) {
   return Response.json(
    { error: 'Invalid AI response format', details: identityValidation.error.errors },
    { status: 500 }
   );
  }

  return Response.json(identityValidation.data, { status: 200 });

 } catch (error) {
  console.error('Business transformation error:', error);
  return Response.json(
   {
    error: 'Failed to process request',
    ...(error instanceof Error && { details: error.message })
   },
   { status: 500 }
  );
 }
}