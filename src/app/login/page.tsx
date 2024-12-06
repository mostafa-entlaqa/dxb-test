'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { EyeIcon, EyeOffIcon, KeyRound, Mail, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // First sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) throw signInError

      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication failed')

      // Check if profile exists and is completed
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, profile_completed')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) throw profileError

      if (!profile) {
        // Profile doesn't exist, redirect to complete profile
        router.push('/complete-profile')
        return
      }

      if (!profile.profile_completed) {
        router.push('/complete-profile')
        return
      }

      // Profile exists and is completed, redirect based on role
      router.push(profile.role === 'admin' ? '/admin' : '/dashboard')

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusMessage = () => {
    const status = searchParams.get('status')
    const message = searchParams.get('message')

    switch (status) {
      case 'confirmation-pending':
        return {
          title: 'Email Confirmation Required',
          message: 'We\'ve sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.',
          variant: 'default' as const,
          icon: <Mail className="h-6 w-6 text-blue-600" />
        }
      case 'confirmation-success':
        return {
          title: 'Email Confirmed Successfully',
          message: 'Your email has been confirmed. You can now sign in to your account.',
          variant: 'default' as const,
          icon: <CheckCircle2 className="h-6 w-6 text-green-600" />
        }
      case 'confirmation-error':
        return {
          title: 'Email Confirmation Failed',
          message: message || 'There was an error confirming your email. Please try again or contact support.',
          variant: 'destructive' as const,
          icon: <XCircle className="h-6 w-6 text-red-600" />
        }
      case 'already-confirmed':
        return {
          title: 'Email Already Confirmed',
          message: 'Your email has already been confirmed. You can sign in to your account.',
          variant: 'default' as const,
          icon: <CheckCircle2 className="h-6 w-6 text-green-600" />
        }
      default:
        return null
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="container max-w-lg mx-auto px-4 py-16">
      {statusMessage && (
        <div className={cn(
          "mb-8 p-4 rounded-lg border flex items-start gap-3",
          statusMessage.variant === 'destructive' 
            ? "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800" 
            : "bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800"
        )}>
          {statusMessage.icon}
          <div>
            <h2 className={cn(
              "text-lg font-semibold mb-1",
              statusMessage.variant === 'destructive'
                ? "text-red-800 dark:text-red-200"
                : "text-blue-800 dark:text-blue-200"
            )}>
              {statusMessage.title}
            </h2>
            <p className={cn(
              statusMessage.variant === 'destructive'
                ? "text-red-600 dark:text-red-300"
                : "text-blue-600 dark:text-blue-300"
            )}>
              {statusMessage.message}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        className="pl-10"
                      />
                    </FormControl>
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"}
                        className="pl-10"
                      />
                    </FormControl>
                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Link 
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <Link 
                href="/signup"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 