'use client'

import { useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { useState } from 'react'
import StripePaymentForm from './StripePaymentForm'
import { toast } from './ui/use-toast'

interface Step1Props {
  icon: LucideIcon
}

export default function Step1({ icon: Icon }: Step1Props) {
  const { formState: { errors }, setValue, watch } = useFormContext()
  const [showPayment, setShowPayment] = useState(false)
  const listingType = watch('listingType')

  const handleListingTypeChange = (value: string) => {
    setValue('listingType', value, { shouldValidate: true })
    if (value === 'paid') {
      setShowPayment(true)
    } else {
      setShowPayment(false)
    }
  }

  const handlePaymentSuccess = () => {
    setValue('paymentStatus', 'completed')
    toast({
      title: "Payment Successful",
      description: "Your premium listing has been activated.",
    })
  }

  const handlePaymentError = (error: string) => {
    setValue('listingType', 'free')
    setShowPayment(false)
    setValue('paymentStatus', 'failed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Choose Your Listing Type</h2>
      </div>
      <div>
        <RadioGroup 
          defaultValue="free" 
          onValueChange={handleListingTypeChange}
          className={errors.listingType ? "border-red-500 border rounded-lg p-2" : ""}
        >
          <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-blue-50 transition-colors">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="flex-grow cursor-pointer">
              <div className="font-medium">Free Listing</div>
              <p className="text-sm text-gray-500">Basic listing with essential features</p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-blue-50 transition-colors mt-2">
            <RadioGroupItem value="paid" id="paid" />
            <Label htmlFor="paid" className="flex-grow cursor-pointer">
              <div className="font-medium">Premium Listing - 1,499 AED</div>
              <p className="text-sm text-gray-500">Enhanced visibility and premium features</p>
            </Label>
          </div>
        </RadioGroup>
        {errors.listingType && (
          <p className="text-red-500 text-sm mt-1 px-2">
            {errors.listingType.message as string}
          </p>
        )}
      </div>

      {showPayment && (
        <StripePaymentForm 
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-800">Benefits of Premium Listing:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>All Free Listing features</li>
          <li>Featured Ad for One Month</li>
          <li>Promoted on Social Media</li>
          <li>Hands-on support</li>
          <li>Organized buyers & CRM tracking</li>
          <li>Priority placement in search results</li>
          <li>Detailed analytics and insights</li>
        </ul>
      </div>
    </div>
  )
}
