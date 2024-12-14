'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

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
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 2) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
      
      router.push('/login')
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-24">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
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
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <Progress 
                      value={(passwordStrength / 4) * 100} 
                      className={cn(
                        "h-2",
                        passwordStrengthLevels[passwordStrength].color
                      )}
                    />
                    <div className="text-xs flex justify-between text-muted-foreground">
                      <span>Password Strength:</span>
                      <span>{passwordStrengthLevels[passwordStrength].label}</span>
                    </div>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                      <li className={cn(password.length >= 8 && "text-green-500")}>
                        At least 8 characters
                      </li>
                      <li className={cn(/[A-Z]/.test(password) && "text-green-500")}>
                        At least one uppercase letter
                      </li>
                      <li className={cn(/[a-z]/.test(password) && "text-green-500")}>
                        At least one lowercase letter
                      </li>
                      <li className={cn(/[0-9]/.test(password) && "text-green-500")}>
                        At least one number
                      </li>
                      <li className={cn(/[^A-Za-z0-9]/.test(password) && "text-green-500")}>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
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
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 