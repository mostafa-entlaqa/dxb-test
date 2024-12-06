'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "Home": "Home",
    "About Us": "About Us",
    "Buy Business": "Buy Business",
    "Sell Business": "Sell Business",
    "Contact": "Contact",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",

    // Hero Section
    "The Largest Business Marketplace in UAE": "The Largest Business Marketplace in UAE",
    "Find your perfect business opportunity or sell your business with ease": "Find your perfect business opportunity or sell your business with ease",
    "Find a Business": "Find a Business",
    "Sell Your Business": "Sell Your Business",
    "Search": "Search",
    "Select Industry": "Select Industry",
    "Price Range": "Price Range",
    "Profit Margin": "Profit Margin",

    // Features
    "Features": "Features",
    "For Buyers": "For Buyers",
    "For Sellers": "For Sellers",
    "Business Information": "Business Information",
    "Comprehensive details on each listed business": "Comprehensive details on each listed business",

    // Why Choose Us
    "Why Choose Us": "Why Choose Us",
    "Discover why businesses trust us for their buying and selling needs": "Discover why businesses trust us for their buying and selling needs",
    "Largest Marketplace": "Largest Marketplace",
    "Access the biggest selection of businesses in the UAE": "Access the biggest selection of businesses in the UAE",
    "Trusted Sources": "Trusted Sources",
    "All listings are verified and from reliable sources": "All listings are verified and from reliable sources",
  },
  ar: {
    // Navigation
    "Home": "الرئيسية",
    "About Us": "من نحن",
    "Buy Business": "شراء شركة",
    "Sell Business": "بيع شركة",
    "Contact": "اتصل بنا",
    "Sign In": "تسجيل الدخول",
    "Sign Up": "إنشاء حساب",

    // Hero Section
    "The Largest Business Marketplace in UAE": "أكبر سوق للشركات في الإمارات",
    "Find your perfect business opportunity or sell your business with ease": "اعثر على فرصتك التجارية المثالية أو بع شركتك بسهولة",
    "Find a Business": "ابحث عن شركة",
    "Sell Your Business": "بع شركتك",
    "Search": "بحث",
    "Select Industry": "اختر القطاع",
    "Price Range": "نطاق السعر",
    "Profit Margin": "هامش الربح",

    // Features
    "Features": "المميزات",
    "For Buyers": "للمشترين",
    "For Sellers": "للبائعين",
    "Business Information": "معلومات الشركة",
    "Comprehensive details on each listed business": "تفاصيل شاملة عن كل شركة معروضة",

    // Why Choose Us
    "Why Choose Us": "لماذا تختارنا",
    "Discover why businesses trust us for their buying and selling needs": "اكتشف لماذا تثق بنا الشركات لاحتياجات البيع والشراء",
    "Largest Marketplace": "أكبر سوق",
    "Access the biggest selection of businesses in the UAE": "الوصول إلى أكبر مجموعة من الشركات في الإمارات",
    "Trusted Sources": "مصادر موثوقة",
    "All listings are verified and from reliable sources": "جميع القوائم تم التحقق منها ومن مصادر موثوقة",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with null to handle hydration
  const [language, setLanguage] = useState<Language | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language preference on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language
      // Set default to 'en' if no saved preference
      setLanguage(savedLanguage && ['en', 'ar'].includes(savedLanguage) ? savedLanguage : 'en')
    } catch (error) {
      setLanguage('en') // Fallback to English if localStorage fails
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    if (language && !isLoading) {
      try {
        localStorage.setItem('language', language)
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = language
      } catch (error) {
        console.error('Failed to save language preference:', error)
      }
    }
  }, [language, isLoading])

  const t = (key: string): string => {
    if (!language) return translations['en'][key] || key
    return translations[language][key] || key
  }

  // Don't render until initial language is loaded
  if (isLoading) {
    return null // Or a loading spinner if preferred
  }

  return (
    <LanguageContext.Provider value={{ 
      language: language || 'en', 
      setLanguage: (newLang: Language) => setLanguage(newLang), 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

