'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  onPaymentSuccess: () => void
  onPaymentError: (error: string) => void
}

export default function StripePaymentForm({ onPaymentSuccess, onPaymentError }: StripePaymentFormProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()

      // Load Stripe
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            token: 'tok_visa' // Test card token
          },
        },
      })

      if (error) {
        throw error
      }

      if (paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        })
        onPaymentSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Premium Listing Payment</h3>
        <p className="text-blue-600 mb-4">Amount: 1,499 AED</p>
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
      <div className="text-sm text-gray-500">
        <p>This is a test mode payment. Use card number: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date, CVC: Any 3 digits</p>
      </div>
    </div>
  )
}
