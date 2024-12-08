'use client'

import { Suspense } from 'react'
import BusinessList from '@/components/business-list'
import BusinessFilters from '@/components/business-filters'
import { Building2, ArrowDownWideNarrow, LayoutGrid } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'

interface InsightsData {
  active_listings: number
  price_range_min: number
  price_range_max: number
  industries_count: number
}

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
  sortBy?: 'price_asc' | 'price_desc' | 'profit_asc' | 'profit_desc'
  page?: number
}

export default function BuyBusinessPage() {
  const searchParams = useSearchParams()
  const [insights, setInsights] = useState<InsightsData>({
    active_listings: 0,
    price_range_min: 0,
    price_range_max: 0,
    industries_count: 0
  })
  const [filters, setFilters] = useState<FilterParams>(() => ({
    categoryId: searchParams.get('categoryId') || undefined,
    areaId: searchParams.get('areaId') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    page: 1
  }))
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true)

        // Get active listings count
        const { count: activeListings } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })

        // Get price range
        const { data: priceData } = await supabase
          .from('businesses')
          .select('selling_price')
          .order('selling_price', { ascending: true })

        // Get categories count
        const { count: categoriesCount } = await supabase
          .from('business_categories')
          .select('*', { count: 'exact', head: true })

        if (priceData) {
          const prices = priceData.map(b => b.selling_price).filter(Boolean)
          
          setInsights({
            active_listings: activeListings || 0,
            price_range_min: prices.length ? Math.min(...prices) : 0,
            price_range_max: prices.length ? Math.max(...prices) : 0,
            industries_count: categoriesCount || 0
          })
        }
      } catch (error) {
        console.error('Error fetching insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [supabase])

  const handleFilter = (newFilters: FilterParams) => {
    // Reset page when applying new filters
    setFilters({ ...newFilters, page: 1 })
  }

  const handleReset = () => {
    setFilters({ page: 1 })
  }

  const handleSort = (sortBy: FilterParams['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const insightCards = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Active Listings",
      value: insights.active_listings,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <ArrowDownWideNarrow className="h-5 w-5" />,
      title: "Price Range",
      value: insights.price_range_min === 0 && insights.price_range_max === 0 
        ? "No listings"
        : `${new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            maximumFractionDigits: 0
          }).format(insights.price_range_min)} - ${new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            maximumFractionDigits: 0
          }).format(insights.price_range_max)}`,
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Industries",
      value: insights.industries_count,
      color: "text-orange-600 dark:text-orange-400"
    }
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Buy a Business
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {insightCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className={cn("flex items-center gap-2 mb-2", card.color)}>
              {card.icon}
              <h3 className="font-semibold">{card.title}</h3>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex gap-4">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleSort(value as FilterParams['sortBy'])}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="profit_asc">Profit Margin: Low to High</SelectItem>
                <SelectItem value="profit_desc">Profit Margin: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <BusinessFilters
          onFilter={handleFilter}
          onReset={handleReset}
          initialFilters={filters}
        />
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      }>
        <BusinessList 
          filters={filters}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </div>
  )
}

