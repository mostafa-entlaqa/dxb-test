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
  const [searchType, setSearchType] = React.useState('buy')

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-3 shadow-lg">
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl">
        {['buy', 'sell', 'invest'].map((type) => (
          <Button
            key={type}
            variant={searchType === type ? 'default' : 'ghost'}
            className="flex-1 rounded-xl capitalize"
            onClick={() => setSearchType(type)}
          >
            {type}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <Select>
          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 rounded-xl h-12">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 rounded-xl h-12">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  )
}

