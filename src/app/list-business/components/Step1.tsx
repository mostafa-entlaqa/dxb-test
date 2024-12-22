'use client'

import { useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from '../../../components/ui/use-toast'
import { useSearchParams } from 'next/navigation'

interface Step1Props {
  icon: LucideIcon
}

export default function Step1({ icon: Icon }: Step1Props) {
  const { formState: { errors }, setValue, getValues, watch } = useFormContext()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')
  const listingType = watch('listingType')

  useEffect(() => {
    // Reset to free if payment was canceled
    if (canceled) {
      setValue('listingType', 'free')
    }
    // Set to paid only if payment was successful
    else if (success === 'true') {
      setValue('listingType', 'paid')
    }
  }, [success, canceled, setValue])

  const handleListingTypeChange = async (value: string) => {
    if (success === 'true' && value === 'free') {
      // Don't allow changing to free if payment was successful
      return
    }

    if (value === 'paid') {
      try {
        setIsLoading(true)
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        if (url) {
          // Don't set the value until payment is confirmed
          window.location.href = url
          return
        }
      } catch (error) {
        console.error('Checkout error:', error)
        toast({
          title: "Error",
          description: "Failed to initiate payment. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    setValue('listingType', value, { shouldValidate: true })
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
          disabled={isLoading}
          value={listingType}
        >
          <div className={`flex items-center space-x-2 p-4 border rounded-md transition-colors ${
            success === 'true' 
              ? 'opacity-50 cursor-not-allowed bg-gray-100' 
              : 'hover:bg-blue-50 cursor-pointer'
          }`}>
            <RadioGroupItem 
              value="free" 
              id="free" 
              disabled={success === 'true' || isLoading}
            />
            <Label 
              htmlFor="free" 
              className={`flex-grow ${success === 'true' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium">Free Listing</div>
              <p className="text-sm text-gray-500">Basic listing with essential features</p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-blue-50 transition-colors mt-2">
            <RadioGroupItem value="paid" id="paid" disabled={isLoading} />
            <Label htmlFor="paid" className="flex-grow cursor-pointer">
              <div className="font-medium">Premium Listing - 1,499 AED</div>
              <p className="text-sm text-gray-500">Enhanced visibility and premium features</p>
              {success === 'true' && (
                <p className="text-green-600 text-sm mt-1">✓ Payment completed</p>
              )}
            </Label>
          </div>
        </RadioGroup>
        {errors.listingType && (
          <p className="text-red-500 text-sm mt-1 px-2">
            {errors.listingType.message as string}
          </p>
        )}
        {isLoading && (
          <p className="text-blue-600 text-sm mt-2">
            Preparing payment session...
          </p>
        )}
      </div>

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
