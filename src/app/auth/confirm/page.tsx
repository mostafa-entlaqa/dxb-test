'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmContent />
      </Suspense>
    </div>
  )
}

function ConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirmEmailChange = async () => {
      const token_hash = searchParams.get('token_hash')
      const next = searchParams.get('next') ?? '/'
      const type = searchParams.get('type')

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash,
        })
        if (!error) {
          router.push(next)
        }
      }
    }

    confirmEmailChange()
  }, [searchParams, router, supabase.auth])

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-4">Confirming your action...</h1>
      <p className="text-muted-foreground">Please wait while we verify your request.</p>
    </div>
  )
}
