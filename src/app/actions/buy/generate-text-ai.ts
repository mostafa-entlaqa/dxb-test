'use server'
import { client } from "@/utils/openai";

interface GenerateTextResponse {
  businessName?: string;
  description?: string;
  error?: string;
}

interface BusinessCategory {
  id: number;
  name: string;
  slug: string;
}

interface Area {
  id: number;
  name: string;
  slug: string;
}

interface Business {
  id: number;
  opportunity_name: string;
  business_name: string;
  description: string;
  selling_price: number;
  profit_margin: number;
  featured: boolean;
  created_at: string;
  images: string[];
  business_categories: BusinessCategory;
  areas: Area;
}

// Type for raw Supabase response
interface RawBusiness {
  id: number;
  opportunity_name: string;
  business_name: string;
  description: string;
  selling_price: number;
  profit_margin: number;
  featured: boolean;
  created_at: string;
  images: string[];
  business_categories: BusinessCategory[];
  areas: Area[];
}

export const generateText = async (businessName: string, location: string): Promise<GenerateTextResponse> => {
  try {
    const prompt = `Generate a creative and professional business name and description for the following business:
    Original Business Name: ${businessName}
    Location: ${location}
    
    Requirements:
    1. Business Name: Create a catchy, market-ready name (max 50 characters)
    2. Description: Write a compelling business description (max 200 characters)
    3. Format the response as JSON with 'businessName' and 'description' fields
    
    Keep the tone professional and focus on business value.`;

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    
    return {
      businessName: response.businessName,
      description: response.description
    };
  } catch (error) {
    console.error('Error generating text:', error);
    return {
      error: 'Failed to generate business text'
    };
  }
}

interface FilterParams {
  categoryId?: string;
  areaId?: string;
  minPrice?: string;
  maxPrice?: string;
  minProfitMargin?: string;
  maxProfitMargin?: string;
  page?: number;
  sortBy?: string;
}

interface BusinessResponse {
  businesses: Business[];
  count: number;
}

const transformRawBusiness = (raw: RawBusiness): Business => ({
  ...raw,
  business_categories: raw.business_categories[0],
  areas: raw.areas[0]
});

export const getBusinessData = async (filters: FilterParams): Promise<BusinessResponse> => {
  const { createServerComponentClient } = await import('@supabase/auth-helpers-nextjs');
  const { cookies } = await import('next/headers');
  
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const from = ((filters?.page || 1) - 1) * 25;
    const to = from + 24;

    let query = supabase
      .from('businesses')
      .select(`
        id,
        opportunity_name,
        business_name,
        description,
        selling_price,
        profit_margin,
        featured,
        created_at,
        images,
        business_categories!inner (id, name, slug),
        areas!inner (id, name, slug)
      `, { count: 'exact' })
      .range(from, to);

    // Apply filters
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.areaId) {
      query = query.eq('area_id', filters.areaId);
    }
    if (filters?.minPrice) {
      query = query.gte('selling_price', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte('selling_price', filters.maxPrice);
    }
    if (filters?.minProfitMargin) {
      query = query.gte('profit_margin', filters.minProfitMargin);
    }
    if (filters?.maxProfitMargin) {
      query = query.lte('profit_margin', filters.maxProfitMargin);
    }

    // Apply sorting
    if (filters?.sortBy) {
      const [field, direction] = filters.sortBy.split('_');
      query = query.order(field, { ascending: direction === 'asc' });
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    // Transform raw data to match our Business type
    const transformedData = (data as RawBusiness[]).map(transformRawBusiness);

    // Generate AI content for non-featured businesses
    const enhancedData = await Promise.all(transformedData.map(async (business) => {
      if (!business.featured) {
        const aiContent = await generateText(
          business.business_name,
          business.areas.name || 'Dubai'
        );
        return {
          ...business,
          opportunity_name: aiContent.businessName || business.business_name,
          description: aiContent.description || business.description
        };
      }
      return business;
    }));

    return {
      businesses: enhancedData,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
}
