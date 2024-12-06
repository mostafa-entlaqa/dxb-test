'use client'

import { Suspense } from 'react'
import BusinessList from '@/components/business-list'
import BusinessFilters from '@/components/business-filters'
import { useLanguage } from '@/components/language-provider'
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
  const { t, language } = useLanguage()
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [activeFilters, setActiveFilters] = useState<FilterParams>({})

  useEffect(() => {
    const fetchBusinessInsights = async () => {
      const supabase = getSupabase()
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select(`
          id,
          selling_price,
          category_id,
          business_categories (
            name,
            name_ar
          )
        `)

      if (error) {
        console.error('Error fetching businesses:', error)
        return
      }

      if (businesses) {
        // Calculate insights from actual data
        const uniqueCategories = new Set(businesses.map(b => b.category_id))
        const prices = businesses.map(b => b.selling_price).filter(p => p > 0)
        
        setInsights({
          active_listings: businesses.length,
          price_range_min: Math.min(...prices) || 0,
          price_range_max: Math.max(...prices) || 0,
          industries_count: uniqueCategories.size
        })
      }
    }

    fetchBusinessInsights()
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return amount.toString()
  }

  const handleFilterChange = (filters: FilterParams) => {
    setActiveFilters(filters)
  }

  const handleFilterReset = () => {
    setActiveFilters({})
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-4",
            "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
            "bg-clip-text text-transparent",
            language === 'ar' ? 'font-arabic' : ''
          )}>
            {t("Buy a Business")}
          </h1>
          <p className={cn(
            "text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto",
            language === 'ar' ? 'font-arabic' : ''
          )}>
            {t("Browse through our curated selection of businesses for sale in the UAE")}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Listings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className={cn(
              "flex items-center mb-4",
              language === 'ar' ? 'flex-row-reverse' : ''
            )}>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={cn(
                "text-2xl font-semibold",
                language === 'ar' ? 'mr-4 font-arabic' : 'ml-4'
              )}>
                {t("Active Listings")}
              </h3>
            </div>
            <p className={cn(
              "text-4xl font-bold text-gray-900 dark:text-white",
              language === 'ar' ? 'text-right font-arabic' : ''
            )}>
              {insights?.active_listings > 0 ? `${insights.active_listings}+` : '0'}
            </p>
          </div>

          {/* Price Range Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className={cn(
              "flex items-center mb-4",
              language === 'ar' ? 'flex-row-reverse' : ''
            )}>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className={cn(
                "text-2xl font-semibold",
                language === 'ar' ? 'mr-4 font-arabic' : 'ml-4'
              )}>
                {t("Price Range")}
              </h3>
            </div>
            <p className={cn(
              "text-4xl font-bold text-gray-900 dark:text-white",
              language === 'ar' ? 'text-right font-arabic' : ''
            )}>
              {insights && (insights.price_range_min > 0 || insights.price_range_max > 0) 
                ? `${formatCurrency(insights.price_range_min)} - ${formatCurrency(insights.price_range_max)}`
                : t("No data")}
            </p>
          </div>

          {/* Industries Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className={cn(
              "flex items-center mb-4",
              language === 'ar' ? 'flex-row-reverse' : ''
            )}>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <LayoutGrid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className={cn(
                "text-2xl font-semibold",
                language === 'ar' ? 'mr-4 font-arabic' : 'ml-4'
              )}>
                {t("Industries")}
              </h3>
            </div>
            <p className={cn(
              "text-4xl font-bold text-gray-900 dark:text-white",
              language === 'ar' ? 'text-right font-arabic' : ''
            )}>
              {insights?.industries_count > 0 ? `${insights.industries_count}+` : '0'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className={cn(
                "text-2xl font-semibold mb-8",
                language === 'ar' ? 'font-arabic text-right' : ''
              )}>
                {t("Filters")}
              </h2>
              <BusinessFilters 
                onFilter={handleFilterChange}
                onReset={handleFilterReset}
                initialFilters={activeFilters}
              />
            </div>
          </div>

          {/* Business Listings */}
          <div className="w-full lg:w-3/4">
            <Suspense fallback={
              <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            }>
              <BusinessList filters={activeFilters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

