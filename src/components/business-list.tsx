'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSupabase } from '@/utils/supabase-client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, Building2, MapPin, ArrowRight, Calendar, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface Business {
  id: number
  opportunity_name: string
  description: string
  category_id: number
  monthly_revenue: number
  profit_margin: number
  selling_price: number
  acquisition_type: string
  featured: boolean
  images: string[]
  location: string
  established_year: number
  business_categories: {
    name: string
  }
  areas: {
    name: string
  }
}

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
}

interface BusinessListProps {
  filters?: FilterParams
}

export default function BusinessList({ filters }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true)
      const supabase = getSupabase()
      
      let query = supabase
        .from('businesses')
        .select(`
          *,
          business_categories (
            name
          ),
          areas (
            name
          )
        `)
        .eq('status', 'active')

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters?.areaId) {
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

      const { data, error } = await query

      if (error) {
        console.error('Error fetching businesses:', error)
        return
      }

      setBusinesses(data as Business[])
      setIsLoading(false)
    }

    fetchBusinesses()
  }, [filters])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <Card key={business.id} className="flex flex-col">
          <div className="relative h-48">
            <img
              src={business.images[0] || '/placeholder-business.jpg'}
              alt={business.opportunity_name}
              className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
            />
            {business.featured && (
              <Badge className="absolute top-2 right-2">
                Featured
              </Badge>
            )}
          </div>
          
          <CardHeader>
            <CardTitle className="text-xl">{business.opportunity_name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {business.business_categories.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="font-semibold flex items-center">
                  <DollarSign className="h-4 w-4" />
                  {new Intl.NumberFormat('en-AE', {
                    style: 'currency',
                    currency: 'AED',
                    maximumFractionDigits: 0
                  }).format(business.selling_price)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Profit Margin</div>
                <div className="font-semibold flex items-center">
                  <Percent className="h-4 w-4" />
                  {business.profit_margin}%
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {business.areas.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Established {business.established_year}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-4">
            <Button asChild className="w-full">
              <Link href={`/business/${business.id}`} className="flex items-center justify-center">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

