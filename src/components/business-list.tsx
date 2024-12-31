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
    slug: string
  }
  areas: {
    id: number
    name: string
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
        const from = ((filters?.page || 1) - 1) * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1

        let query = supabase
          .from('businesses')
          .select(`
            id,
            opportunity_name,
            selling_price,
            profit_margin,
            featured,
            created_at,
            images,
            business_categories (id, name, slug),
            areas (id, name, slug)
          `, { count: 'exact' })
          .range(from, to)

        // Apply filters
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

        // Apply sorting
        if (filters?.sortBy) {
          const [field, direction] = filters.sortBy.split('_')
          query = query.order(field, { ascending: direction === 'asc' })
        }

        const { data, error, count } = await query
        if (error) throw error
        
        setBusinesses(data || [] as Business[])
        setTotalCount(count || 0)
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinesses()
  }, [filters, supabase])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const currentPage = filters?.page || 1

  if (isLoading) return <div>Loading...</div>
  if (businesses.length === 0) return <div>No businesses found.</div>

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className={cn("flex flex-col", business.featured && "ring-2 ring-blue-500")}>
            <div className="relative h-48">
              <img
                src={business.images?.[0] || '/placeholder-business.jpg'}
                alt={business.opportunity_name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
              />
              {business.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
            </div>
            <CardHeader>
              <CardTitle>{business.opportunity_name}</CardTitle>
              <CardDescription>
                <Building2 className="inline-block w-4 h-4 mr-1" />
                {business.business_categories?.name || 'Uncategorized'}
              </CardDescription>
              <CardDescription>
                <MapPin className="inline-block w-4 h-4 mr-1" />
                {business.areas?.name || 'Location not specified'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <DollarSign className="inline-block w-4 h-4 mr-1" />
                  {new Intl.NumberFormat('en-AE', {
                    style: 'currency',
                    currency: 'AED',
                  }).format(business.selling_price)}
                </div>
                <div>
                  <Percent className="inline-block w-4 h-4 mr-1" />
                  {business.profit_margin}%
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/business/${business.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => onPageChange(i + 1)}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
        </Pagination>
      )}
    </div>
  )
}
