'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { type Category, type Area } from '@/actions/user/buy/get-filter-options'

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
  sortBy?: string
  page?: number
}

interface BusinessFiltersProps {
  initialFilters: FilterParams
  initialCategories: Category[]
  initialAreas: Area[]
}

export default function BusinessFilters({
  initialFilters,
  initialCategories,
  initialAreas
}: BusinessFiltersProps) {



  const router = useRouter()
  const [categories] = useState<Category[]>(initialCategories)
  const [areas] = useState<Area[]>(initialAreas)
  const [filters, setFilters] = useState<FilterParams>(initialFilters)


  const [localMinPrice, setLocalMinPrice] = useState(initialFilters.minPrice || '')
  const [localMaxPrice, setLocalMaxPrice] = useState(initialFilters.maxPrice || '')
  const [localMinProfit, setLocalMinProfit] = useState(initialFilters.minProfitMargin || '')
  const [localMaxProfit, setLocalMaxProfit] = useState(initialFilters.maxProfitMargin || '')

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newSearchParams.set(key, value)
        }
      })

      return newSearchParams.toString()
    },
    []
  )

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: 1
      }

      const queryString = createQueryString({
        ...newFilters,
        page: '1'
      })

      router.push(`/buy?${queryString}`)
      return newFilters
    })
  }, [router, createQueryString])

  const handleReset = () => {
    const defaultFilters: FilterParams = {
      page: 1,
      sortBy: 'featured_desc',
      categoryId: 'all_categories',  // Add default value for category
      areaId: 'all_areas',          // Add default value for area
      minPrice: '',                 // Reset price inputs
      maxPrice: '',
      minProfitMargin: '',         // Reset profit margin inputs
      maxProfitMargin: ''
    }

    setFilters(defaultFilters)
    router.push('/buy')
  }


  // Add local state for debounced inputs


  // Sync local state with initialFilters changes
  useEffect(() => {
    setLocalMinPrice(initialFilters.minPrice || '')
    setLocalMaxPrice(initialFilters.maxPrice || '')
    setLocalMinProfit(initialFilters.minProfitMargin || '')
    setLocalMaxProfit(initialFilters.maxProfitMargin || '')
  }, [initialFilters])

  // Create debounce effect for price inputs
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange('minPrice', localMinPrice)
    }, 500)
    return () => clearTimeout(timeout)
  }, [localMinPrice])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange('maxPrice', localMaxPrice)
    }, 500)
    return () => clearTimeout(timeout)
  }, [localMaxPrice])

  // Create debounce effect for profit margin inputs
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange('minProfitMargin', localMinProfit)
    }, 500)
    return () => clearTimeout(timeout)
  }, [localMinProfit])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange('maxProfitMargin', localMaxProfit)
    }, 500)
    return () => clearTimeout(timeout)
  }, [localMaxProfit])

  return (
    <div className="space-y-6">


      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>

          <div className="flex justify-between items-center">
            <Select
              value={filters.sortBy || 'featured_desc'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured_desc">Sort by Featured</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="profit_asc">Profit: Low to High</SelectItem>
                <SelectItem value="profit_desc">Profit: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => handleFilterChange('categoryId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Area</label>
            <Select
              value={filters.areaId}
              onValueChange={(value) => handleFilterChange('areaId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_areas">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Price Range (AED)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
              />
            </div>
          </div>


          <div>
            <label className="text-sm font-medium mb-2 block">Profit Margin (%)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localMinProfit}
                onChange={(e) => setLocalMinProfit(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={localMaxProfit}
                onChange={(e) => setLocalMaxProfit(e.target.value)}
              />
            </div>
          </div>

        </div>
        <div className='w-full mt-4 justify-end flex'>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
