'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EmailConfirmationProps {
  email: string
  onResendEmail?: () => Promise<void>
}

export function EmailConfirmation({ email, onResendEmail }: EmailConfirmationProps) {
  const router = useRouter()

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a confirmation link to {email}
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
          {onResendEmail && (
            <Button
              variant="default"
              onClick={onResendEmail}
              className="w-full"
            >
              Resend Confirmation Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 