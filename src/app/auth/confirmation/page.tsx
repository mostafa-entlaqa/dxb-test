'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Icons.mail className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a confirmation link to {email || 'your email address'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Please check your email and click the confirmation link to activate your account.
              If you don't see the email, check your spam folder.
            </p>
            <p className="text-sm">
              Didn't receive the email? You can request a new confirmation link.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Back to Login
            </Button>
            <Button
              variant="default"
              onClick={() => router.push('/signup')}
              className="w-full"
            >
              Create New Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 