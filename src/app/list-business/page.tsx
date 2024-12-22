'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BusinessListingWizard from '@/components/BusinessListingWizard'
import { toast } from '@/components/ui/use-toast'

export default function ListBusinessPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handlePaymentStatus = () => {
      const success = searchParams.get('success')
      const canceled = searchParams.get('canceled')

      if (success) {
        toast({
          title: "Payment Successful",
          description: "Your premium listing has been activated. Please complete your listing details.",
        })
      } else if (canceled) {
        toast({
          title: "Payment Canceled",
          description: "Your payment was canceled. Your listing will be created as a free listing.",
          variant: "destructive"
        })
      }
    }

    handlePaymentStatus()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">List Your Business for Sale</h1>
        <BusinessListingWizard />
      </div>
    </div>
  )
}
