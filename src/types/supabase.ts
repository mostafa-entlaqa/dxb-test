export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: number
          opportunity_name: string
          business_name: string
          description: string
          opportunity_description: string
          monthly_revenue: number
          profit_margin: number
          selling_price: number
          acquisition_type: string
          featured: boolean
          images: string[]
          revenue: Json
          cost: Json
          presentation_file: string
          investment_percentage: number
          financials_file: string
          category_id: number
          area_id: number
          min_price: number
          max_price: number
          min_profit_margin: number
          max_profit_margin: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          opportunity_name: string
          business_name: string
          description: string
          monthly_revenue: number
          profit_margin: number
          selling_price: number
          acquisition_type: string
          featured?: boolean
          images?: string[]
          revenue?: Json
          cost?: Json
          category_id: number
          area_id: number
          min_price: number
          max_price: number
          min_profit_margin: number
        }
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: unknown
    }
    Enums: {
      [key: string]: unknown
    }
  }
} 