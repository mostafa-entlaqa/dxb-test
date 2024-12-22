import { useFormContext } from 'react-hook-form'
import { type LucideIcon, CreditCard } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "../../../components/ui/alert"
import { Button } from "../../../components/ui/button"
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Step5Props {
  icon: LucideIcon
}

export default function Step5({ icon: Icon }: Step5Props) {
  const { watch, getValues, setValue } = useFormContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const listingType = watch('listingType')
  const success = searchParams.get('success')

  const generateStripePaymentLink = async () => {
    try {
      const formData = getValues()
      sessionStorage.setItem('businessListingForm', JSON.stringify(formData))

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
      return url
    } catch (error) {
      console.error('Error generating payment link:', error)
      return null
    }
  }

  useEffect(() => {
    if (success === 'true') {
      const savedData = sessionStorage.getItem('businessListingForm')
      if (savedData) {
        const formData = JSON.parse(savedData)
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) {
            setValue(key, value)
          }
        })
      }
      setValue('listingType', 'paid')
    }
  }, [success, setValue])

  if (listingType === 'free' && !success) {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertTitle className="text-lg font-semibold">Ready to complete your paid listing</AlertTitle>
          <AlertDescription>
            Click the button below to proceed to payment and finalize your listing.
          </AlertDescription>
        </Alert>
        <Button
          onClick={async () => {
            const paymentLink = await generateStripePaymentLink()
            if (paymentLink) {
              window.location.href = paymentLink
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Pay 1,499 AED and List My Business
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Review & Submit</h2>
      </div>
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <AlertTitle className="text-lg font-semibold">Ready to Submit</AlertTitle>
        <AlertDescription>
          {success ? 
            "Your payment has been processed successfully. Click submit to finalize your premium listing." :
            "Your listing details are complete. Click submit to publish your listing."
          }
        </AlertDescription>
      </Alert>
    </div>
  )
}
