'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function PhoneInput({ className, ...props }: PhoneInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        +971
      </div>
      <Input
        type="tel"
        className={cn("pl-14", className)}
        placeholder="50 123 4567"
        {...props}
      />
    </div>
  )
} 