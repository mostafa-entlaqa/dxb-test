'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { UserMenu } from '@/components/user-menu'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser(profile)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getUser()
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className={cn(
          "flex items-center",
          language === 'ar' ? 'space-x-8 space-x-reverse' : 'space-x-8'
        )}>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SellBusiness.ae"
              width={200}
              height={50}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className={cn(
            "hidden md:flex",
            language === 'ar' ? 'space-x-6 space-x-reverse' : 'space-x-6'
          )}>
            {[
              { href: '/', label: t("Home") },
              { href: '/about', label: t("About Us") },
              { href: '/buy', label: t("Buy Business") },
              { href: '/sell', label: t("Sell Business") },
              { href: '/contact', label: t("Contact") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium",
                  "transition-colors duration-200",
                  language === 'ar' ? 'font-arabic text-right' : ''
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={cn(
          "flex items-center",
          language === 'ar' ? 'space-x-4 space-x-reverse' : 'space-x-4'
        )}>
          <ThemeToggle />
          <LanguageToggle />
          
          {!isLoading && (
            <>
              {user ? (
                <UserMenu user={user} />
              ) : (
                <div className={cn(
                  "flex items-center",
                  language === 'ar' ? 'space-x-4 space-x-reverse' : 'space-x-4'
                )}>
                  <Button variant="ghost" asChild>
                    <Link href="/login" className={cn(
                      language === 'ar' ? 'font-arabic' : ''
                    )}>
                      {t("Sign In")}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" className={cn(
                      language === 'ar' ? 'font-arabic' : ''
                    )}>
                      {t("Sign Up")}
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

