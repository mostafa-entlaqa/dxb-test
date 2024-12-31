import { useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type LucideIcon } from 'lucide-react'
import { Category, Area } from './types'

interface Step2Props {
  icon: LucideIcon
  categories: Category[]
  areas: Area[]
}

export default function Step2({ icon: Icon, categories, areas }: Step2Props) {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const acquisition_type = watch('acquisition_type')

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Business Details</h2>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input 
            id="businessName" 
            {...register('businessName')} 
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.businessName.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message as string}
            </p>
          )}
        </div>

    

        <div>
          <Label htmlFor="area">Area</Label>
            <Select value={watch('area_id')} onValueChange={(value) => setValue('area_id', parseInt(value), { shouldValidate: true })}>
              <SelectTrigger className={errors.area_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas?.map((area) => (
                  <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          {errors.area_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.area_id.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={watch('category_id')} onValueChange={(value) => setValue('category_id', parseInt(value), { shouldValidate: true })}>
            <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category"  />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category_id.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="acquisition_type">Acquisition Type</Label>
          <Select onValueChange={(value) => setValue('acquisition_type', value, { shouldValidate: true })}>
            <SelectTrigger className={errors.acquisition_type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select acquisition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Invest">Invest</SelectItem>
            </SelectContent>
          </Select>
          {errors.acquisition_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.acquisition_type.message as string}
            </p>
          )}
        </div>

        {acquisition_type === 'Invest' && (
          <div>
            <Label htmlFor="investmentPercentage">Investment Percentage (%)</Label>
            <Input 
              type="number" 
              id="investmentPercentage" 
              {...register('investmentPercentage', { valueAsNumber: true })} 
              className={errors.investmentPercentage ? "border-red-500" : ""}
              min="1"
              max="100"
            />
            {errors.investmentPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.investmentPercentage.message as string}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
