'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { getSupabase } from '@/utils/supabase-client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, ShoppingCart } from 'lucide-react'

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
}

interface BusinessListProps {
  debug?: boolean
}

export default function BusinessList({ debug = false }: BusinessListProps) {
  const { t, language } = useLanguage()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState('')
  const itemsPerPage = 10

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1)
    fetchBusinesses()
  }

  useEffect(() => {
    fetchBusinesses()
  }, [page, retryCount])

  async function fetchBusinesses() {
    console.log('Fetching businesses...')
    try {
      setLoading(true)
      setError(null)
      setDebugInfo('')

      const supabase = getSupabase()
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      setDebugInfo(prev => prev + '\nAttempting to fetch businesses...')

      const { data, error, count } = await supabase
        .from('businesses')
        .select('*', { count: 'exact' })
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)

      if (error) {
        setDebugInfo(prev => prev + `\nSupabase error: ${JSON.stringify(error)}`)
        throw error
      }

      setDebugInfo(prev => prev + `\nFetched ${data?.length || 0} businesses`)
    
      setBusinesses(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching businesses:', error)
      setError(t('Error fetching businesses. Please try again later.'))
      setDebugInfo(prev => prev + `\nCaught error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>{t("Loading...")}</div>
  if (error) return (
    <div className="text-red-500">
      {error}
      <Button onClick={handleRetry} className="ml-4">
        {t('Retry')}
      </Button>
      {debug && <pre className="mt-4 p-4 bg-gray-100 rounded">{debugInfo}</pre>}
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((business) => (
          <Card key={business.id} className={business.featured ? 'border-2 border-blue-500' : ''}>
            <CardHeader>
              <CardTitle>{business.opportunity_name}</CardTitle>
              <CardDescription>{business.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img src={business.images[0]} alt={business.opportunity_name} className="object-cover rounded-md" />
              </div>
              <p className="text-sm mb-4">{business.description}</p>
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{t("Monthly Revenue")}: {business.monthly_revenue} AED</span>
                </div>
                <div className="flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  <span>{t("Profit Margin")}: {business.profit_margin}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-1" />
                <span>{t("Selling Price")}: {business.selling_price} AED</span>
              </div>
              <Badge>{t(business.acquisition_type)}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div>{t("Showing")} {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, totalCount)} {t("of")} {totalCount}</div>
        <div className="space-x-2">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{t("Previous")}</Button>
          <Button onClick={() => setPage(p => p + 1)} disabled={page * itemsPerPage >= totalCount}>{t("Next")}</Button>
        </div>
      </div>
    </div>
  )
}

