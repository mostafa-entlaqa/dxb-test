import { cn } from "@/lib/utils"

export type PasswordStrengthLevel = {
  label: string
  color: string
}

export type PasswordStrengthLevels = {
  [key: number]: PasswordStrengthLevel
}

export const passwordStrengthLevels: PasswordStrengthLevels = {
  0: { label: "Very Weak", color: "bg-red-500" },
  1: { label: "Weak", color: "bg-orange-500" },
  2: { label: "Medium", color: "bg-yellow-500" },
  3: { label: "Strong", color: "bg-green-500" },
  4: { label: "Very Strong", color: "bg-green-600" },
}

export const calculatePasswordStrength = (password: string): number => {
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

export const getPasswordRequirements = (password: string) => {
  return [
    {
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      text: "At least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      text: "At least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      text: "At least one number",
      met: /[0-9]/.test(password),
    },
    {
      text: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ]
}

export const PasswordRequirementsList = ({ password }: { password: string }) => {
  const requirements = getPasswordRequirements(password)

  return (
    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
      {requirements.map((req, index) => (
        <li key={index} className={cn(req.met && "text-green-500")}>
          {req.text}
        </li>
      ))}
    </ul>
  )
}

