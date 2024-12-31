'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Area {
  id: number
  name: string
  slug: string
}

export interface FilterOptions {
  categories: Category[]
  areas: Area[]
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const [categoriesResult, areasResult] = await Promise.all([
      supabase
        .from('business_categories')
        .select('id, name, slug')
        .order('name'),
      supabase
        .from('areas')
        .select('id, name, slug')
        .order('name')
    ])

    if (categoriesResult.error) throw categoriesResult.error
    if (areasResult.error) throw areasResult.error

    return {
      categories: categoriesResult.data || [],
      areas: areasResult.data || []
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return {
      categories: [],
      areas: []
    }
  }
}
