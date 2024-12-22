import { useFormContext } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { type LucideIcon, CreditCard } from 'lucide-react'

// Mock function to generate a Stripe payment link
const generateStripePaymentLink = async () => {
  // In a real application, this would call your backend to create a Stripe Checkout session
  return 'https://stripe.com/checkout/pay/cs_test_123456789'
}

interface Step5Props {
  icon: LucideIcon
}

export default function Step5({ icon: Icon }: Step5Props) {
  const { watch } = useFormContext()
  const listingType = watch('listingType')

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Finalize Listing</h2>
      </div>
      {listingType === 'free' ? (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertTitle className="text-lg font-semibold">Thank you for your submission!</AlertTitle>
          <AlertDescription>
            Your free listing is now under review. We'll notify you once it's approved.
          </AlertDescription>
        </Alert>
      ) : (
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
              window.location.href = paymentLink
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay 1,499 AED and List My Business
          </Button>
        </div>
      )}
    </div>
  )
}

