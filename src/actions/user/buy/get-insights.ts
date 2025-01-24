'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface InsightsData {
  active_listings: number
  price_range_min: number
  price_range_max: number
  industries_count: number
}

export async function getInsights(): Promise<InsightsData> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const [listingsResult, priceResult, categoriesResult] = await Promise.all([
      supabase.from('businesses').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('selling_price').order('selling_price', { ascending: true }),
      supabase.from('business_categories').select('*', { count: 'exact', head: true })
    ])

    const prices = (priceResult.data || [])
      .map(b => b.selling_price)
      .filter(Boolean)
    
    return {
      active_listings: listingsResult.count || 0,
      price_range_min: prices.length ? Math.min(...prices) : 0,
      price_range_max: prices.length ? Math.max(...prices) : 0,
      industries_count: categoriesResult.count || 0
    }
  } catch (error) {
    console.error('Error fetching insights:', error)
    return {
      active_listings: 0,
      price_range_min: 0,
      price_range_max: 0,
      industries_count: 0
    }
  }
}
