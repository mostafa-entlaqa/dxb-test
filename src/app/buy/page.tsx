'use client'

import { Suspense } from 'react'
import BusinessList from '@/components/business-list'
import BusinessFilters from '@/components/business-filters'
import { Building2, ArrowDownWideNarrow, LayoutGrid, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase-client'
import { cn } from '@/lib/utils'

interface BusinessData {
  id: number;
  selling_price: number;
  category: string;
}

interface InsightsData {
  active_listings: number;
  price_range_min: number;
  price_range_max: number;
  industries_count: number;
}

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
}

export default function BuyBusinessPage() {
  const [insights, setInsights] = useState<InsightsData>({
    active_listings: 0,
    price_range_min: 0,
    price_range_max: 0,
    industries_count: 0
  })
  const [filters, setFilters] = useState<FilterParams>({})

  useEffect(() => {
    const fetchInsights = async () => {
      const supabase = getSupabase()
      const { data: businesses } = await supabase
        .from('businesses')
        .select('selling_price, category')
        .eq('status', 'active')

      if (businesses) {
        const businessData = businesses as BusinessData[]
        const prices = businessData.map(b => b.selling_price)
        const categories = new Set(businessData.map(b => b.category))

        setInsights({
          active_listings: businessData.length,
          price_range_min: Math.min(...prices),
          price_range_max: Math.max(...prices),
          industries_count: categories.size
        })
      }
    }

    fetchInsights()
  }, [])

  const handleFilter = (newFilters: FilterParams) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({})
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
      value: `${new Intl.NumberFormat('en-AE', {
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
        <h2 className="text-xl font-semibold mb-6">Filters</h2>
        <BusinessFilters
          onFilter={handleFilter}
          onReset={handleReset}
          initialFilters={filters}
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BusinessList filters={filters} />
      </Suspense>
    </div>
  )
}

