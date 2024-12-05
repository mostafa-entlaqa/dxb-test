'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/components/language-provider'
import { getSupabase } from '@/utils/supabase-client'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface Category {
  id: number
  name: string
  name_ar: string
  slug: string
}

interface Area {
  id: number
  name: string
  name_ar: string
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

export default function BusinessFilters({ onFilter, onReset, initialFilters = {} }: BusinessFiltersProps) {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [filters, setFilters] = useState<FilterParams>(initialFilters)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabase()

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('business_categories')
        .select('*')
        .order('name')

      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Fetch areas
      const { data: areasData } = await supabase
        .from('areas')
        .select('*')
        .order('name')

      if (areasData) {
        setAreas(areasData)
      }
    }

    fetchData()
  }, [])

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  return (
    <form onSubmit={handleFilter} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Business Category")}
          </Label>
          <Select
            onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
          >
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select category")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id.toString()}
                  className={language === 'ar' ? 'font-arabic text-right' : ''}
                >
                  {language === 'ar' ? category.name_ar : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Business Price (AED)")}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className={cn(
              "relative",
              language === 'ar' ? 'text-right' : 'text-left'
            )}>
              <Input
                type="number"
                placeholder={t("Min Price")}
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className={cn(
                  'mt-2 placeholder:text-gray-400',
                  language === 'ar' ? 'font-arabic text-right pr-4' : ''
                )}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className={cn(
              "relative",
              language === 'ar' ? 'text-right' : 'text-left'
            )}>
              <Input
                type="number"
                placeholder={t("Max Price")}
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className={cn(
                  'mt-2 placeholder:text-gray-400',
                  language === 'ar' ? 'font-arabic text-right pr-4' : ''
                )}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Profit Margin (%)")}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className={cn(
              "relative",
              language === 'ar' ? 'text-right' : 'text-left'
            )}>
              <Input
                type="number"
                placeholder={t("Min Margin")}
                value={filters.minProfitMargin}
                onChange={(e) => setFilters(prev => ({ ...prev, minProfitMargin: e.target.value }))}
                className={cn(
                  'mt-2 placeholder:text-gray-400',
                  language === 'ar' ? 'font-arabic text-right pr-4' : ''
                )}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className={cn(
              "relative",
              language === 'ar' ? 'text-right' : 'text-left'
            )}>
              <Input
                type="number"
                placeholder={t("Max Margin")}
                value={filters.maxProfitMargin}
                onChange={(e) => setFilters(prev => ({ ...prev, maxProfitMargin: e.target.value }))}
                className={cn(
                  'mt-2 placeholder:text-gray-400',
                  language === 'ar' ? 'font-arabic text-right pr-4' : ''
                )}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Area")}
          </Label>
          <Select
            onValueChange={(value) => setFilters(prev => ({ ...prev, areaId: value }))}
          >
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select area")} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem 
                  key={area.id} 
                  value={area.id.toString()}
                  className={language === 'ar' ? 'font-arabic text-right' : ''}
                >
                  {language === 'ar' ? area.name_ar : area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className={cn(
              'flex-1 h-auto py-2',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            {t("Filter")}
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleReset}
            className={cn(
              'flex-1 h-auto py-2',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            {t("Reset")}
          </Button>
        </div>
      </div>
    </form>
  )
}

