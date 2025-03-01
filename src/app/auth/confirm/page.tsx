'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getClientSupabase() /// i change to getClientSupabase() because createClientComponentClient() is not working

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        
        if (!token_hash) {
          // Check if we're returning from a callback
          const next = searchParams.get('next')
          if (next === '/auth/callback') {
            router.replace('/login?status=already-confirmed')
            return
          }
          router.replace('/login?status=confirmation-error&message=Invalid confirmation link')
          return
        }

        // Exchange the token for a session
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any || 'signup',
        })

        if (error) {
          router.replace(`/login?status=confirmation-error&message=${encodeURIComponent(error.message)}`)
          return
        }

        // Redirect to login with success status
        router.replace('/login?status=confirmation-success')

      } catch (error) {
        router.replace(`/login?status=confirmation-error&message=${encodeURIComponent(error instanceof Error ? error.message : 'An error occurred during confirmation')}`)
      }
    }

    handleEmailConfirmation()
  }, [router, searchParams, supabase.auth])

  return null
} 