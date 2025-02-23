'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { DollarSign, TrendingUp, PieChart, Share2 } from "lucide-react"

interface EditFinancialsWidgetProps {
  business: any
  onSave: (data: any) => void
}

export default function EditFinancialsWidget({ business, onSave }: EditFinancialsWidgetProps) {
  const [financials, setFinancials] = useState({
    selling_price: business.selling_price,
    monthly_revenue: business.monthly_revenue,
    profit_margin: business.profit_margin,
    investment_percentage: business.investment_percentage
  })

  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setFinancials(prev => ({
      ...prev,
      [field]: numValue
    }))
    onSave({ ...business, [field]: numValue })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-400">Key Financials</h2>
      
      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
        <label className="text-sm font-medium flex items-center">
          <DollarSign className="mr-2 text-green-600 dark:text-green-400" />
          {business.acquisition_type === 'Buy' ? 'Selling Price' : 'Required Investment'}
        </label>
        <Input
          type="number"
          value={financials.selling_price}
          onChange={(e) => handleChange('selling_price', e.target.value)}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
        <label className="text-sm font-medium flex items-center">
          <TrendingUp className="mr-2 text-blue-600 dark:text-blue-400" />
          Monthly Revenue
        </label>
        <Input
          type="number"
          value={financials.monthly_revenue}
          onChange={(e) => handleChange('monthly_revenue', e.target.value)}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
        <label className="text-sm font-medium flex items-center">
          <PieChart className="mr-2 text-purple-600 dark:text-purple-400" />
          Profit Margin (%)
        </label>
        <Input
          type="number"
          value={financials.profit_margin}
          onChange={(e) => handleChange('profit_margin', e.target.value)}
        />
      </div>

      {business.acquisition_type === 'Invest' && (
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Share2 className="mr-2 text-orange-600 dark:text-orange-400" />
            Equity (%)
          </label>
          <Input
            type="number"
            value={financials.investment_percentage}
            onChange={(e) => handleChange('investment_percentage', e.target.value)}
          />
        </div>
      )}
    </div>
  )
} 