'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, Building2, MapPin, ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Business {
  id: number
  opportunity_name: string
  business_name: string
  description: string
  monthly_revenue: number
  profit_margin: number
  selling_price: number
  acquisition_type: string
  featured: boolean
  images: string[]
  revenue: any // jsonb in DB
  cost: any // jsonb in DB
  category_id: number
  area_id: number
  min_price: number
  max_price: number
  min_profit_margin: number
  created_at: string
  updated_at: string
  business_categories: {
    id: number
    name: string
    name_ar: string
    slug: string
  }
  areas: {
    id: number
    name: string
    name_ar: string
    slug: string
  }
}

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
  page?: number
  sortBy?: string
}

interface BusinessListProps {
  filters?: FilterParams
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 25

export default function BusinessList({ filters, onPageChange }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true)
        
        // Calculate pagination range
        const from = ((filters?.page || 1) - 1) * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1

        let query = supabase
          .from('businesses')
          .select(`
            id,
            opportunity_name,
            business_name,
            description,
            monthly_revenue,
            profit_margin,
            selling_price,
            acquisition_type,
            featured,
            images,
            revenue,
            cost,
            category_id,
            area_id,
            min_price,
            max_price,
            min_profit_margin,
            created_at,
            updated_at,
            business_categories!inner (
              id,
              name,
              name_ar,
              slug
            ),
            areas!inner (
              id,
              name,
              name_ar,
              slug
            )
          `, { count: 'exact' })

        // Apply filters
        if (filters?.categoryId) {
          query = query.eq('category_id', parseInt(filters.categoryId))
        }
        if (filters?.areaId) {
          query = query.eq('area_id', parseInt(filters.areaId))
        }
        if (filters?.minPrice) {
          query = query.gte('selling_price', parseFloat(filters.minPrice))
        }
        if (filters?.maxPrice) {
          query = query.lte('selling_price', parseFloat(filters.maxPrice))
        }
        if (filters?.minProfitMargin) {
          query = query.gte('profit_margin', parseFloat(filters.minProfitMargin))
        }
        if (filters?.maxProfitMargin) {
          query = query.lte('profit_margin', parseFloat(filters.maxProfitMargin))
        }

        // Apply sorting
        switch (filters?.sortBy) {
          case 'price_asc':
            query = query.order('selling_price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('selling_price', { ascending: false })
            break
          case 'profit_asc':
            query = query.order('profit_margin', { ascending: true })
            break
          case 'profit_desc':
            query = query.order('profit_margin', { ascending: false })
            break
          default:
            // Default sorting: Featured first, then by created_at
            query = query.order('featured', { ascending: false })
                        .order('created_at', { ascending: false })
        }

        // Apply pagination
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) throw error

        setBusinesses(data as Business[] || [])
        setTotalCount(count || 0)
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinesses()
  }, [supabase, filters])

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

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later for new listings
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const currentPage = filters?.page || 1

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {businesses.map((business) => (
          <Card key={business.id} className={cn(
            "flex flex-col",
            business.featured && "ring-2 ring-blue-500 dark:ring-blue-400"
          )}>
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
                  Listed {new Date(business.created_at).toLocaleDateString()}
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

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

