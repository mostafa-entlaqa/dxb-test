'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

const industries = [
  'Retail',
  'Food & Beverage',
  'Technology',
  'Manufacturing',
  'Healthcare',
  'Real Estate',
  'Construction',
  'Automotive',
  'Education',
  'Other'
]

const priceRanges = [
  'Under AED 500K',
  'AED 500K - 1M',
  'AED 1M - 2M',
  'AED 2M - 5M',
  'AED 5M - 10M',
  'Above AED 10M'
]

export function BusinessSearch() {
  const { t, language } = useLanguage()
  const [searchType, setSearchType] = React.useState('buy')

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-3 shadow-lg">
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl">
        {['buy', 'sell', 'invest'].map((type) => (
          <Button
            key={type}
            variant={searchType === type ? 'default' : 'ghost'}
            className={cn(
              'flex-1 rounded-xl capitalize',
              language === 'ar' ? 'font-arabic' : ''
            )}
            onClick={() => setSearchType(type)}
          >
            {t(type)}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <Select>
          <SelectTrigger className={cn(
            'bg-gray-50 dark:bg-gray-700 rounded-xl h-12',
            language === 'ar' ? 'font-arabic' : ''
          )}>
            <SelectValue placeholder={t("Select Industry")} />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry.toLowerCase()}>
                {t(industry)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className={cn(
            'bg-gray-50 dark:bg-gray-700 rounded-xl h-12',
            language === 'ar' ? 'font-arabic' : ''
          )}>
            <SelectValue placeholder={t("Price Range")} />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {t(range)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
          <Search className="mr-2 h-4 w-4" />
          {t("Search")}
        </Button>
      </div>
    </div>
  )
}

