'use server'


import { cookies } from 'next/headers'
import { client as openai } from '@/utils/openai'
import { getServerSupabase } from '@/lib/supabase/server'

interface BusinessCategory {
  id: number
  name: string
  slug: string
}

interface Area {
  id: number
  name: string
  slug: string
}

export interface Business {
  id: number
  opportunity_name: string
  business_name: string
  description: string
  selling_price: number
  profit_margin: number
  featured: boolean
  images: string[]
  category_id: number
  area_id: number
  category?: BusinessCategory
  area?: Area
}

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
  sortBy?: string
  page?: number
}

interface BusinessResponse {
  businesses: Business[]
  count: number
}

async function generateAIContent(businessName: string, location: string) {
  try {
    const prompt = `Generate a creative and professional business name and description for the following business:
    Original Business Name: ${businessName}
    Location: ${location}
    
    Requirements:
    1. Business Name: Create a catchy, market-ready name (max 50 characters)
    2. Description: Write a compelling business description (max 200 characters)
    3. Format the response as JSON with 'businessName' and 'description' fields
    
    Keep the tone professional and focus on business value.`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    return {
      businessName: response.businessName,
      description: response.description
    };
  } catch (error) {
    console.error('Error generating AI content:', error);
    return null;
  }
}

export async function getBusinesses(filters: FilterParams): Promise<BusinessResponse> {
  const supabase = getServerSupabase()
  
  try {
    const from = ((filters?.page || 1) - 1) * 12
    const to = from + 11

    let query = supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .range(from, to)
      .eq('form_status', 'published')
      .eq('approve_status','approved')     // Only get businesses where approve is not null

    // Apply filters
    if (filters?.categoryId && filters.categoryId !== 'all_categories') {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters?.areaId && filters.areaId !== 'all_areas') {
      query = query.eq('area_id', filters.areaId)
    }
    if (filters?.minPrice) {
      query = query.gte('selling_price', filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte('selling_price', filters.maxPrice)
    }
    if (filters?.minProfitMargin) {
      query = query.gte('profit_margin', filters.minProfitMargin)
    }
    if (filters?.maxProfitMargin) {
      query = query.lte('profit_margin', filters.maxProfitMargin)
    }

    // Apply sorting
    if (filters?.sortBy) {
      const [field, direction] = filters.sortBy.split('_')
      if (field === 'price') {
        query = query.order('selling_price', { ascending: direction === 'asc' })
          .order('featured', { ascending: false }) // Featured items first within price order
      } else if (field === 'profit') {
        query = query.order('profit_margin', { ascending: direction === 'asc' })
          .order('featured', { ascending: false }) // Featured items first within profit order
      } else if (field === 'featured') {
        query = query.order('featured', { ascending: false })
          .order('id', { ascending: false })
      }
    } else {
      // Default sorting: featured first, then by id
      query = query.order('featured', { ascending: false })
        .order('id', { ascending: false })
    }

    const { data: businesses, error, count } = await query
    
    if (error) throw error

    // Get all unique category and area IDs
    const categoryIds = [...new Set(businesses?.map(b => b.category_id) || [])]
    const areaIds = [...new Set(businesses?.map(b => b.area_id) || [])]

    // Fetch categories and areas
    const [categoriesResult, areasResult] = await Promise.all([
      supabase
        .from('business_categories')
        .select('id, name, slug')
        .in('id', categoryIds),
      supabase
        .from('areas')
        .select('id, name, slug')
        .in('id', areaIds)
    ])

    // Create lookup maps
    const categoriesMap = new Map(
      categoriesResult.data?.map(cat => [cat.id, cat]) || []
    )
    const areasMap = new Map(
      areasResult.data?.map(area => [area.id, area]) || []
    )

    // Combine the data
    const enhancedBusinesses = (businesses || []).map(business => ({
      ...business,
      category: categoriesMap.get(business.category_id),
      area: areasMap.get(business.area_id)
    }))

    // Generate AI content for non-featured businesses
   

    return {
      businesses: enhancedBusinesses,
      count: count || 0
    }
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return {
      businesses: [],
      count: 0
    }
  }
}
