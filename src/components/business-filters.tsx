'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSupabase } from '@/utils/supabase-client'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

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

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
}

interface BusinessFiltersProps {
  onFilter: (filters: FilterParams) => void
  onReset: () => void
  initialFilters?: FilterParams
}

export default function BusinessFilters({ onFilter, onReset, initialFilters }: BusinessFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [filters, setFilters] = useState<FilterParams>(initialFilters || {})

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabase()
      
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
    }

    fetchData()
  }, [])

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleFilterChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={filters.areaId}
            onValueChange={(value) => handleFilterChange('areaId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Profit Margin (%)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minProfitMargin || ''}
              onChange={(e) => handleFilterChange('minProfitMargin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxProfitMargin || ''}
              onChange={(e) => handleFilterChange('maxProfitMargin', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

