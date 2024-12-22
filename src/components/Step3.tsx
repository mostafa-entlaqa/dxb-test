import { useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { type LucideIcon, Plus, Trash2 } from 'lucide-react'

interface Step3Props {
  icon: LucideIcon
}

type YearlyData = Record<string, number>

export default function Step3({ icon: Icon }: Step3Props) {
  const { register, setValue, watch, formState: { errors } } = useFormContext()
  const revenuePerYear = watch('revenuePerYear') as YearlyData || {}
  const cost = watch('cost') as YearlyData || {}

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

  const addRevenueYear = (selectedYear: string) => {
    if (!revenuePerYear[selectedYear]) {
      setValue(`revenuePerYear.${selectedYear}`, 0)
    }
  }

  const addCostYear = (selectedYear: string) => {
    if (!cost[selectedYear]) {
      setValue(`cost.${selectedYear}`, 0)
    }
  }

  const removeRevenueYear = (year: string) => {
    const newRevenue = { ...revenuePerYear }
    delete newRevenue[year]
    setValue('revenuePerYear', newRevenue)
  }

  const removeCostYear = (year: string) => {
    const newCost = { ...cost }
    delete newCost[year]
    setValue('cost', newCost)
  }

  const availableRevenueYears = years.filter(year => !revenuePerYear[year])
  const availableCostYears = years.filter(year => !cost[year])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Financial Information</h2>
      </div>
      <div className="space-y-4">
       

        <div>
          <Label htmlFor="monthlyRevenue">Monthly Revenue (AED)</Label>
          <Input 
            type="number" 
            id="monthlyRevenue" 
            {...register('monthlyRevenue', { valueAsNumber: true })}
            className={errors.monthlyRevenue ? "border-red-500" : ""}
          />
          {errors.monthlyRevenue && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthlyRevenue.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="profitMargin">Profit Margin (%)</Label>
          <Input 
            type="number" 
            id="profitMargin" 
            {...register('profitMargin', { valueAsNumber: true })}
            className={errors.profitMargin ? "border-red-500" : ""}
          />
          {errors.profitMargin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profitMargin.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="sellingPrice">Selling Price (AED)</Label>
          <Input 
            type="number" 
            id="sellingPrice" 
            {...register('sellingPrice', { valueAsNumber: true })}
            className={errors.sellingPrice ? "border-red-500" : ""}
          />
          {errors.sellingPrice && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sellingPrice.message as string}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Revenue Per Year (Optional)</Label>
            {availableRevenueYears.length > 0 && (
              <Select onValueChange={addRevenueYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Add Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableRevenueYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {Object.entries(revenuePerYear).map(([year, revenue]) => (
            <div key={year} className="flex items-center space-x-2 mt-2">
              <Input
                type="number"
                value={year}
                disabled
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Revenue"
                value={revenue}
                onChange={(e) => setValue(`revenuePerYear.${year}`, parseFloat(e.target.value))}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRevenueYear(year)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Annual Cost (Optional)</Label>
            {availableCostYears.length > 0 && (
              <Select onValueChange={addCostYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Add Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableCostYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {Object.entries(cost).map(([year, cost]) => (
            <div key={year} className="flex items-center space-x-2 mt-2">
              <Input
                type="number"
                value={year}
                disabled
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Cost"
                value={cost}
                onChange={(e) => setValue(`cost.${year}`, parseFloat(e.target.value))}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCostYear(year)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
