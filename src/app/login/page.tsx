'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      {status === 'confirmation-pending' && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Email Confirmation Required
          </h2>
          <p className="text-blue-600 dark:text-blue-300">
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.
          </p>
        </div>
      )}

      {/* Rest of login form */}
    </div>
  )
} 