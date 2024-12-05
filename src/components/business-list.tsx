'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { getSupabase } from '@/utils/supabase-client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, Building2, MapPin, ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface Business {
  id: number
  opportunity_name: string
  description: string
  category: string
  monthly_revenue: number
  profit_margin: number
  selling_price: number
  acquisition_type: string
  featured: boolean
  images: string[]
  location: string
  established_year: number
}

export default function BusinessList() {
  const { t, language } = useLanguage()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  useEffect(() => {
    fetchBusinesses()
  }, [page])

  async function fetchBusinesses() {
    try {
      setLoading(true)
      setError(null)
      const supabase = getSupabase()

      const { data, error, count } = await supabase
        .from('businesses')
        .select('*', { count: 'exact' })
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
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
                  {t(business.category)}
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
                    {business.location}
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
              <div className="w-full flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("Asking Price")}
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(business.selling_price)}
                  </div>
                </div>
                <Button className="ml-auto">
                  {t("View Details")}
                  <ArrowRight className="ml-2 w-4 h-4" />
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
            'gap-2',
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
            'gap-2',
            language === 'ar' ? 'font-arabic flex-row-reverse' : ''
          )}
        >
          {t("Next")}
        </Button>
      </div>
    </div>
  )
}

