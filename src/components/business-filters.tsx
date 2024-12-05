'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BusinessFilters() {
  const { t } = useLanguage()
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    acquisitionType: '',
    annualRevenue: '',
    profitMargin: '',
    area: '',
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setFilters({
      category: '',
      price: '',
      acquisitionType: '',
      annualRevenue: '',
      profitMargin: '',
      area: '',
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">{t("Business Category")}</Label>
        <Select onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder={t("Select category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cafe">{t("Cafe")}</SelectItem>
            <SelectItem value="restaurant">{t("Restaurant")}</SelectItem>
            <SelectItem value="retail">{t("Retail")}</SelectItem>
            {/* Add more categories as needed */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price">{t("Business Price")}</Label>
        <Input
          id="price"
          type="number"
          placeholder={t("Enter price")}
          onChange={(e) => handleFilterChange('price', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="acquisitionType">{t("Acquisition Type")}</Label>
        <Select onValueChange={(value) => handleFilterChange('acquisitionType', value)}>
          <SelectTrigger id="acquisitionType">
            <SelectValue placeholder={t("Select type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">{t("Buy")}</SelectItem>
            <SelectItem value="invest">{t("Invest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="annualRevenue">{t("Annual Revenue")}</Label>
        <Select onValueChange={(value) => handleFilterChange('annualRevenue', value)}>
          <SelectTrigger id="annualRevenue">
            <SelectValue placeholder={t("Select revenue range")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-100000">{t("0 - 100,000 AED")}</SelectItem>
            <SelectItem value="100000-500000">{t("100,000 - 500,000 AED")}</SelectItem>
            <SelectItem value="500000-1000000">{t("500,000 - 1,000,000 AED")}</SelectItem>
            <SelectItem value="1000000+">{t("1,000,000+ AED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="profitMargin">{t("Profit Margin")}</Label>
        <Input
          id="profitMargin"
          type="number"
          placeholder={t("Enter profit margin %")}
          onChange={(e) => handleFilterChange('profitMargin', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="area">{t("Area")}</Label>
        <Select onValueChange={(value) => handleFilterChange('area', value)}>
          <SelectTrigger id="area">
            <SelectValue placeholder={t("Select area")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dubai">{t("Dubai")}</SelectItem>
            <SelectItem value="abu-dhabi">{t("Abu Dhabi")}</SelectItem>
            <SelectItem value="ras-al-khaimah">{t("Ras Al Khaimah")}</SelectItem>
            {/* Add more areas as needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2">
        <Button className="flex-1">{t("Filter")}</Button>
        <Button variant="outline" className="flex-1" onClick={handleReset}>{t("Reset")}</Button>
      </div>
    </div>
  )
}

