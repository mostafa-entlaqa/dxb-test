'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')

        if (!code) {
          router.replace('/login?status=confirmation-error&message=Invalid verification link')
          return
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) throw error

        if (data.user) {
          // Check if user exists in users table
          const { data: profile } = await supabase
            .from('users')
            .select('profile_completed')
            .eq('id', data.user.id)
            .single()

          // Redirect based on profile completion
          if (profile?.profile_completed) {
            router.replace('/dashboard')
          } else {
            router.replace('/complete-profile')
          }
          return
        }

        router.replace('/login?status=confirmation-success')
      } catch (error) {
        console.error('Auth callback error:', error)
        router.replace(
          `/login?status=confirmation-error&message=${encodeURIComponent(
            error instanceof Error ? error.message : 'Authentication failed'
          )}`
        )
      }
    }

    handleCallback()
  }, [router, searchParams, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we complete the verification process.</p>
      </div>
    </div>
  )
} 