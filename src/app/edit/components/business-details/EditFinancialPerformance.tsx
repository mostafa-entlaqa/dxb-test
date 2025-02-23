'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface EditFinancialPerformanceProps {
  business: any
  onSave: (data: any) => void
}

export default function EditFinancialPerformance({ business, onSave }: EditFinancialPerformanceProps) {
  const [revenue, setRevenue] = useState<Record<string, number>>(business.revenue || {})
  const [cost, setCost] = useState<Record<string, number>>(business.cost || {})
  const [newYear, setNewYear] = useState<string>('')
  const [customYear, setCustomYear] = useState<string>('')

  const currentYear = 2025
  const availableYears = Array.from(
    { length: 6 },
    (_, i) => (currentYear - 5 + i).toString()
  )

  const validateYear = (year: string) => {
    const yearNum = parseInt(year)
    if (isNaN(yearNum)) return false
    if (yearNum < 1900 || yearNum > 2100) return false
    if (years.includes(year)) return false
    return true
  }

  const handleAddYear = (yearToAdd: string) => {
    if (!validateYear(yearToAdd)) {
      toast({
        title: "Error",
        description: "Invalid year. Please enter a year between 1900 and 2100",
        variant: "destructive"
      })
      return
    }

    setRevenue(prev => ({ ...prev, [yearToAdd]: 0 }))
    setCost(prev => ({ ...prev, [yearToAdd]: 0 }))
    setNewYear('')
    setCustomYear('')
  }

  const handleYearSelect = (value: string) => {
    if (value === 'other') {
      setNewYear(value)
    } else {
      setNewYear(value)
      handleAddYear(value)
    }
  }

  const handleRevenueChange = (year: string, value: string) => {
    const newRevenue = { ...revenue, [year]: parseFloat(value) || 0 }
    setRevenue(newRevenue)
    onSave({ revenue: newRevenue })
  }

  const handleCostChange = (year: string, value: string) => {
    const newCost = { ...cost, [year]: parseFloat(value) || 0 }
    setCost(newCost)
    onSave({ cost: newCost })
  }

  const handleRemoveYear = (yearToRemove: string) => {
    const newRevenue = { ...revenue }
    const newCost = { ...cost }
    delete newRevenue[yearToRemove]
    delete newCost[yearToRemove]
    setRevenue(newRevenue)
    setCost(newCost)
    onSave({ revenue: newRevenue, cost: newCost })
  }

  const years = [...new Set([...Object.keys(revenue), ...Object.keys(cost)])].sort()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-800">Financial Performance</h2>
        <div className="flex gap-2 items-center">
          {newYear === 'other' ? (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter year"
                value={customYear}
                onChange={(e) => setCustomYear(e.target.value)}
                className="w-[120px]"
                min="1900"
                max="2100"
              />
              <Button
                onClick={() => handleAddYear(customYear)}
                disabled={!customYear}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          ) : (
            <Select value={newYear} onValueChange={handleYearSelect}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears
                  .filter(year => !years.includes(year))
                  .map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {years.map((year) => (
          <div key={year} className="flex gap-4 items-center">
            <div className="w-20 font-semibold">{year}</div>
            <div className="flex-1">
              <label className="text-sm font-medium">Revenue</label>
              <Input
                type="number"
                value={revenue[year] || 0}
                onChange={(e) => handleRevenueChange(year, e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Cost</label>
              <Input
                type="number"
                value={cost[year] || 0}
                onChange={(e) => handleCostChange(year, e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-5"
              onClick={() => handleRemoveYear(year)}
            >
              <Minus className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {years.length === 0 && (
        <div className="text-center py-6 border border-dashed rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">No financial data added yet</p>
        </div>
      )}
    </div>
  )
} 