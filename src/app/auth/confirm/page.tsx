'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function ConfirmPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token and type from URL
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        
        if (!token_hash || !type) {
          throw new Error('Missing confirmation parameters')
        }

        // Exchange the token for a session
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })

        if (error) throw error

      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred during confirmation')
      } finally {
        setIsLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [searchParams, supabase.auth])

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 text-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <Icons.spinner className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Confirming your email...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Confirmation Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            <Button 
              onClick={() => router.push('/signup')}
              className="w-full max-w-sm"
            >
              Back to Sign Up
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Confirmed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been successfully confirmed. You can now log in to your account.
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full max-w-sm"
            >
              Go to Login
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
} 