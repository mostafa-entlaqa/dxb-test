'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Category {
  id: number
  name: string
  slug: string
}

interface Area {
  id: number
  name: string
  slug: string
}

interface SearchFilters {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('business_categories')
          .select('id, name, slug')
          .order('name')
        
        // Fetch areas
        const { data: areasData } = await supabase
          .from('areas')
          .select('id, name, slug')
          .order('name')
        
        if (categoriesData) setCategories(categoriesData)
        if (areasData) setAreas(areasData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build query string from filters
    const queryParams = new URLSearchParams()
    
    // Only add filters that have values and aren't 'all'
    if (filters.categoryId && filters.categoryId !== 'all') {
      queryParams.append('categoryId', filters.categoryId)
    }
    if (filters.areaId && filters.areaId !== 'all') {
      queryParams.append('areaId', filters.areaId)
    }
    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice)
    }
    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice)
    }

    // Navigate to buy page with filters
    const queryString = queryParams.toString()
    router.push(queryString ? `/buy?${queryString}` : '/buy')
  }

  const handlePriceChange = (type: 'minPrice' | 'maxPrice', value: string) => {
    // Remove any non-numeric characters and convert to number
    const numericValue = value.replace(/[^0-9]/g, '')
    setFilters(prev => ({ ...prev, [type]: numericValue }))
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
            Find Your Next Business Opportunity
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover verified businesses for sale in the UAE. Whether you're looking to buy an existing business or sell your own, we're here to help.
          </p>
        </div>

        <Card className="p-6 md:p-8 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.areaId}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, areaId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Min Price (AED)"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="text-right"
                />
              </div>
              <div>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Max Price (AED)"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit"
                size="lg" 
                className="w-full md:w-auto min-w-[200px]"
                disabled={isLoading}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Businesses
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/buy" className="flex items-center">
              Browse All Businesses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/sell" className="flex items-center">
              List Your Business
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

