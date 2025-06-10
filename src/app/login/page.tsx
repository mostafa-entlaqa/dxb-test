'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientSupabase } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/signup" className="hover:text-brand underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()

  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  )
}

function LoginFormContent() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('') // Clear previous errors

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Set appropriate error message
        switch (error.message) {
          case "Invalid login credentials":
            setError("Invalid email or password. Please try again.")
            break
          case "Too many requests":
            setError("Too many attempts. Please wait a few minutes before trying again.")
            break
          case "Email not confirmed":
            setError("Your email address is not confirmed. Please check your inbox for the confirmation link.")
            // router.push(`/auth/confirmation?email=${encodeURIComponent(email)}`)
            break
          default:
            setError("An error occurred during login. Please try again.")
        }
        return
      }

      router.refresh()
      router.push(next || '/')

    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  )
}
