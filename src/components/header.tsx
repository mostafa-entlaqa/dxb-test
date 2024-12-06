'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import { Globe } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Header() {
  const { setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="relative w-[280px] h-16">
            <img
              src="/logo.png"
              alt="SellBusiness.ae"
              className="h-full w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link href="/" className={`text-base text-foreground/80 hover:text-foreground transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Home")}
            </Link>
            <Link href="/about" className={`text-base text-foreground/80 hover:text-foreground transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("About Us")}
            </Link>
            <Link href="/buy" className={`text-base text-foreground/80 hover:text-foreground transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Buy a Business")}
            </Link>
            <Link href="/sell" className={`text-base text-foreground/80 hover:text-foreground transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Sell a Business")}
            </Link>
            <Link href="/contact" className={`text-base text-foreground/80 hover:text-foreground transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Contact Us")}
            </Link>
          </nav>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="rounded-full"
            >
              <Globe className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle language</span>
            </Button>
            <Button variant="ghost" className={`rounded-full text-base ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Sign In")}
            </Button>
            <Button className={`rounded-full text-base bg-blue-600 hover:bg-blue-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("Sign Up")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

