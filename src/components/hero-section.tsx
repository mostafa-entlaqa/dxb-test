'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase-client'

interface Category {
  id: number
  name: string
  name_ar: string
}

export default function HeroSection() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchParams, setSearchParams] = useState({
    industry: '',
    priceRange: '',
    profitMargin: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getSupabase()
      const { data } = await supabase
        .from('business_categories')
        .select('id, name, name_ar')
        .order('name')
      
      if (data) setCategories(data)
    }

    fetchCategories()
  }, [])

  const priceRanges = [
    { value: '0-500000', label: 'Under AED 500K' },
    { value: '500000-1000000', label: 'AED 500K - 1M' },
    { value: '1000000-2000000', label: 'AED 1M - 2M' },
    { value: '2000000-5000000', label: 'AED 2M - 5M' },
    { value: '5000000-10000000', label: 'AED 5M - 10M' },
    { value: '10000000-999999999', label: 'Above AED 10M' }
  ]

  const profitMargins = [
    { value: '0-10', label: '0-10%' },
    { value: '10-20', label: '10-20%' },
    { value: '20-30', label: '20-30%' },
    { value: '30-40', label: '30-40%' },
    { value: '40-plus', label: 'Above 40%' }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const queryParams = new URLSearchParams()
    
    if (searchParams.industry) {
      queryParams.set('categoryId', searchParams.industry)
    }
    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split('-')
      queryParams.set('minPrice', min)
      queryParams.set('maxPrice', max)
    }
    if (searchParams.profitMargin) {
      const [min, max] = searchParams.profitMargin.split('-')
      queryParams.set('minProfitMargin', min)
      queryParams.set('maxProfitMargin', max === 'plus' ? '100' : max)
    }

    router.push(`/buy?${queryParams.toString()}`)
  }

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className={cn(
            "text-5xl md:text-6xl font-bold mb-6",
            "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
            "bg-clip-text text-transparent",
            "leading-[1.2]",
            "tracking-tight",
            language === 'ar' ? 'font-arabic' : ''
          )}>
            {t("The Largest Business Marketplace in UAE")}
          </h1>
          <p className={cn(
            "text-xl md:text-2xl",
            "mb-8",
            "text-gray-700 dark:text-gray-300",
            "leading-relaxed",
            language === 'ar' ? 'font-arabic' : ''
          )}>
            {t("Find your perfect business opportunity or sell your business with ease")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-6 shadow-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={searchParams.industry}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger className={cn(
                    "h-14 rounded-full bg-white dark:bg-gray-800",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <SelectValue placeholder={t("Select Industry")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                        className={language === 'ar' ? 'font-arabic' : ''}
                      >
                        {language === 'ar' ? category.name_ar : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.priceRange}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, priceRange: value }))}
                >
                  <SelectTrigger className={cn(
                    "h-14 rounded-full bg-white dark:bg-gray-800",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <SelectValue placeholder={t("Price Range")} />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className={language === 'ar' ? 'font-arabic' : ''}
                      >
                        {t(range.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.profitMargin}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, profitMargin: value }))}
                >
                  <SelectTrigger className={cn(
                    "h-14 rounded-full bg-white dark:bg-gray-800",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <SelectValue placeholder={t("Profit Margin")} />
                  </SelectTrigger>
                  <SelectContent>
                    {profitMargins.map((margin) => (
                      <SelectItem 
                        key={margin.value} 
                        value={margin.value}
                        className={language === 'ar' ? 'font-arabic' : ''}
                      >
                        {t(margin.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  type="submit"
                  className={cn(
                    "h-14 rounded-full",
                    "bg-blue-600 hover:bg-blue-700",
                    "text-white font-semibold text-lg",
                    "flex items-center justify-center gap-2",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}
                >
                  <Search className="w-5 h-5" />
                  {t("Search")}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button 
            asChild 
            size="lg" 
            className={cn(
              'min-w-[200px] text-base font-semibold',
              'rounded-full bg-blue-600 hover:bg-blue-700 text-white',
              'shadow-lg hover:shadow-xl transition-all duration-300',
              'h-12 px-8',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            <Link href="/buy" className="flex items-center justify-center">
              {t("Buy a Business")}
              <ArrowRight className={cn(
                "ml-2 w-5 h-5",
                language === 'ar' && "rotate-180 mr-2 ml-0"
              )} />
            </Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className={cn(
              'min-w-[200px] text-base font-semibold',
              'rounded-full border-2 border-blue-600 text-blue-600',
              'hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400',
              'dark:hover:bg-blue-950/50',
              'shadow-lg hover:shadow-xl transition-all duration-300',
              'h-12 px-8',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            <Link href="/sell" className="flex items-center justify-center">
              {t("Sell Your Business")}
              <ArrowRight className={cn(
                "ml-2 w-5 h-5",
                language === 'ar' && "rotate-180 mr-2 ml-0"
              )} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

