import { useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type LucideIcon } from 'lucide-react'

interface Step2Props {
  icon: LucideIcon
}

export default function Step2({ icon: Icon }: Step2Props) {
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
          <Label htmlFor="opportunityName">Opportunity Name</Label>
          <Input 
            id="opportunityName" 
            {...register('opportunityName')} 
            className={errors.opportunityName ? "border-red-500" : ""}
          />
          {errors.opportunityName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.opportunityName.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="area">Area</Label>
          <Select onValueChange={(value) => setValue('area_id', parseInt(value), { shouldValidate: true })}>
            <SelectTrigger className={errors.area_id ? "border-red-500" : ""}>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Dubai</SelectItem>
              <SelectItem value="2">Abu Dhabi</SelectItem>
              <SelectItem value="3">Sharjah</SelectItem>
              <SelectItem value="4">Ajman</SelectItem>
              <SelectItem value="5">Ras Al Khaimah</SelectItem>
              <SelectItem value="6">Umm Al Quwain</SelectItem>
              <SelectItem value="7">Fujairah</SelectItem>
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
          <Select onValueChange={(value) => setValue('category_id', parseInt(value), { shouldValidate: true })}>
            <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Cafe</SelectItem>
              <SelectItem value="2">Restaurant</SelectItem>
              <SelectItem value="3">Retail Store</SelectItem>
              <SelectItem value="4">E-commerce</SelectItem>
              <SelectItem value="5">Manufacturing</SelectItem>
              <SelectItem value="6">Healthcare</SelectItem>
              <SelectItem value="7">Real Estate</SelectItem>
              <SelectItem value="8">Construction</SelectItem>
              <SelectItem value="9">Automotive</SelectItem>
              <SelectItem value="10">Education</SelectItem>
              <SelectItem value="11">Technology</SelectItem>
              <SelectItem value="12">Services</SelectItem>
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
