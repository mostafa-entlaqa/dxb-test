import type { Database } from '@/types/supabase'

export type Business = Database['public']['Tables']['businesses']['Row']

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