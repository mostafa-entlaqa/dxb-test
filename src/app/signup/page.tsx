'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { User, UserCircle, ShieldCheck, Check, EyeIcon, EyeOffIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

type PasswordStrengthLevel = {
  label: string;
  color: string;
}

type PasswordStrengthLevels = {
  [key: number]: PasswordStrengthLevel;
}

const passwordStrengthLevels: PasswordStrengthLevels = {
  0: { label: 'Very Weak', color: 'bg-red-500' },
  1: { label: 'Weak', color: 'bg-orange-500' },
  2: { label: 'Medium', color: 'bg-yellow-500' },
  3: { label: 'Strong', color: 'bg-green-500' },
  4: { label: 'Very Strong', color: 'bg-green-600' },
} as const

const accountFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const accountForm = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }

    // Base score from length
    if (password.length >= 12) score += 2
    else if (password.length >= 8) score += 1

    // Add points for character variety
    if (checks.hasUpperCase) score += 1
    if (checks.hasLowerCase) score += 1
    if (checks.hasNumber) score += 1
    if (checks.hasSpecialChar) score += 1

    // Bonus point for having all types
    if (Object.values(checks).every(Boolean)) score += 1

    // Normalize score to 0-4 range
    return Math.min(Math.floor((score / 7) * 4), 4)
  }

  const handleSubmit = async (data: AccountFormData) => {
    setIsLoading(true)
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create initial profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            role: 'user',
            profile_completed: false
          })
          .single()

        if (profileError && profileError.code !== '23505') { // Ignore unique violation
          throw profileError
        }
      }

      toast({
        title: 'Account created successfully',
        description: 'Please check your email for the confirmation link',
      })

      router.push('/login?status=confirmation-pending')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Enter your email and create a strong password</p>
        </div>
        
        <Form {...accountForm}>
          <form onSubmit={accountForm.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={accountForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                          field.onChange(e)
                          setPasswordStrength(calculatePasswordStrength(e.target.value))
                        }}
                      />
                    </FormControl>
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
                  <div className="mt-2 space-y-2">
                    <Progress 
                      value={((passwordStrength + 1) / 5) * 100} 
                      className={cn(
                        "h-2",
                        passwordStrength === 0 && "bg-red-100 dark:bg-red-900",
                        passwordStrength === 1 && "bg-orange-100 dark:bg-orange-900",
                        passwordStrength === 2 && "bg-yellow-100 dark:bg-yellow-900",
                        passwordStrength === 3 && "bg-green-100 dark:bg-green-900",
                        passwordStrength === 4 && "bg-green-200 dark:bg-green-900",
                      )}
                    />
                    {passwordStrength >= 0 && (
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-xs font-medium",
                          passwordStrengthLevels[passwordStrength].color.replace('bg-', 'text-')
                        )}>
                          Password Strength: {passwordStrengthLevels[passwordStrength].label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((passwordStrength + 1) / 5) * 100}% Complete
                        </p>
                      </div>
                    )}
                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                      <li className={cn(field.value.length >= 8 && "text-green-500")}>
                        At least 8 characters
                      </li>
                      <li className={cn(/[A-Z]/.test(field.value) && "text-green-500")}>
                        At least one uppercase letter
                      </li>
                      <li className={cn(/[a-z]/.test(field.value) && "text-green-500")}>
                        At least one lowercase letter
                      </li>
                      <li className={cn(/[0-9]/.test(field.value) && "text-green-500")}>
                        At least one number
                      </li>
                      <li className={cn(/[^A-Za-z0-9]/.test(field.value) && "text-green-500")}>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={accountForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showConfirmPassword ? "text" : "password"} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 