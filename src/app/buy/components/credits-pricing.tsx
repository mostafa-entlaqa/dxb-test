'use client'
import { Button } from '@/components/ui/button'
import { Brain, LockOpen, Clock, Infinity } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'

export function CreditsPricing() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [price, setPrice] = useState<number>(1499)

  useEffect(() => {
    const fetchPrice = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'one_time_pay')
        .single()

      if (error) {
        console.error('Error fetching price:', error)
        return
      }

      if (data) {
        setPrice(parseFloat(data.value))
      }
    }

    fetchPrice()
  }, [])

  const handlePurchase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        toast({
          title: 'Authentication Required',
          description: 'Please login to purchase credits',
          variant: 'destructive'
        })
        return
      }

      // Create a checkout session
      const response = await fetch('/api/business/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price,
          credits: {
            unlock: 20,
            aiAnalysis: 20
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      toast({
        title: 'Error',
        description: 'Failed to initiate purchase. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const features = [
    {
      icon: <LockOpen className="h-5 w-5" />,
      title: "20 Business Unlock Credits",
      description: "View detailed business information"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "20 AI Analysis Credits",
      description: "Get AI-powered business insights"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Instant Access",
      description: "Start using credits immediately"
    },
    {
      icon: <Infinity className="h-5 w-5" />,
      title: "No Expiration",
      description: "Credits never expire"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 shadow-lg">
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Business Credits Package
            </h2>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Unlock business details and get AI analysis
            </p>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                AED {price.toLocaleString()}
              </span>
              <span className="text-base font-medium text-gray-500 dark:text-gray-400 ml-2">
                one-time
              </span>
            </div>
            <Button
              onClick={handlePurchase}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
            >
              Purchase Credits
            </Button>
          </div>

          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                    {feature.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 