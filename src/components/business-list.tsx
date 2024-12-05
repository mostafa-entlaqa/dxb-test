'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
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
    name_ar: string
  }
  areas: {
    name: string
    name_ar: string
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
  const { t, language } = useLanguage()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  const formatCurrency = (amount: number) => {
    const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
      currencyDisplay: 'code'
    }).format(amount)
    
    return formatter.replace('AED', t('AED'))
  }

  useEffect(() => {
    fetchBusinesses()
  }, [page, filters])

  async function fetchBusinesses() {
    try {
      setLoading(true)
      setError(null)
      const supabase = getSupabase()

      let query = supabase
        .from('businesses')
        .select(`
          *,
          business_categories (
            name,
            name_ar
          ),
          areas (
            name,
            name_ar
          )
        `, { count: 'exact' })
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (filters) {
        if (filters.categoryId) {
          query = query.eq('category_id', filters.categoryId)
        }
        if (filters.areaId) {
          query = query.eq('area_id', filters.areaId)
        }
        if (filters.minPrice) {
          query = query.gte('selling_price', parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
          query = query.lte('selling_price', parseFloat(filters.maxPrice))
        }
        if (filters.minProfitMargin) {
          query = query.gte('profit_margin', parseFloat(filters.minProfitMargin))
        }
        if (filters.maxProfitMargin) {
          query = query.lte('profit_margin', parseFloat(filters.maxProfitMargin))
        }
      }

      const { data, error, count } = await query
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)

      if (error) throw error
      setBusinesses(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching businesses:', error)
      setError(t('Error fetching businesses. Please try again later.'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-48 bg-gray-200 dark:bg-gray-700" />
            <CardContent className="space-y-4 p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <Button onClick={fetchBusinesses} className="ml-4">
          {t('Retry')}
        </Button>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <LayoutGrid className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className={`text-xl font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("No Results Found")}
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("Can't find a business that match your criteria")}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className={cn(
            'mt-4 h-auto py-2',
            language === 'ar' ? 'font-arabic' : ''
          )}
        >
          {t("Reset Filters")}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((business) => (
          <Card 
            key={business.id} 
            className={cn(
              "group hover:shadow-lg transition-all duration-300 overflow-hidden",
              business.featured && "ring-2 ring-blue-500 dark:ring-blue-400"
            )}
          >
            <CardHeader className="p-0">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={business.images[0]} 
                  alt={business.opportunity_name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                {business.featured && (
                  <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600">
                    {t("Featured")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-sm">
                  {language === 'ar' 
                    ? business.business_categories?.name_ar 
                    : business.business_categories?.name}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {t(business.acquisition_type)}
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {business.opportunity_name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mb-4">
                {business.description}
              </CardDescription>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar' 
                      ? business.areas?.name_ar 
                      : business.areas?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Est.")} {business.established_year}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("Monthly Revenue")}
                  </div>
                  <div className="font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(business.monthly_revenue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("Profit Margin")}
                  </div>
                  <div className="font-semibold flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    {business.profit_margin}%
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className={cn(
                "w-full flex items-center",
                language === 'ar' ? 'flex-row-reverse justify-between' : 'justify-between'
              )}>
                <div className={cn(
                  "flex flex-col",
                  language === 'ar' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    "text-sm text-gray-500 dark:text-gray-400 mb-1",
                    language === 'ar' ? 'text-right' : 'text-left'
                  )}>
                    {t("Asking Price")}
                  </div>
                  <div className={cn(
                    "text-xl font-bold text-blue-600 dark:text-blue-400",
                    language === 'ar' ? 'text-right' : 'text-left'
                  )}>
                    {formatCurrency(business.selling_price)}
                  </div>
                </div>
                <Button 
                  className={cn(
                    'h-10 px-4',
                    language === 'ar' ? 'flex flex-row-reverse items-center gap-2 font-arabic' : 'flex items-center gap-2'
                  )}
                >
                  {t("View Details")}
                  <ArrowRight className={cn(
                    "w-4 h-4",
                    language === 'ar' ? 'rotate-180' : ''
                  )} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className={cn(
        "flex justify-between items-center mt-8",
        language === 'ar' ? 'flex-row-reverse' : ''
      )}>
        <Button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
          className={cn(
            'gap-2 h-auto py-2 px-4',
            language === 'ar' ? 'font-arabic flex-row-reverse' : ''
          )}
        >
          {t("Previous")}
        </Button>
        <Button
          onClick={() => setPage(prev => prev + 1)}
          disabled={page * itemsPerPage >= totalCount}
          variant="outline"
          className={cn(
            'gap-2 h-auto py-2 px-4',
            language === 'ar' ? 'font-arabic flex-row-reverse' : ''
          )}
        >
          {t("Next")}
        </Button>
      </div>
    </div>
  )
}

