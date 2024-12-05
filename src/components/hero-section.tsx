'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { ArrowRight } from 'lucide-react'
import { BusinessSearch } from '@/components/business-search'

export default function HeroSection() {
  const { t, language } = useLanguage()

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className={`text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t("The Largest Business Marketplace in UAE")}
          </h1>
          <p className={`text-2xl mb-8 text-gray-700 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t("Find your perfect business opportunity or sell your business with ease")}
          </p>
        </div>

        <BusinessSearch />

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-12">
          <Button asChild size="lg" className={`rounded-full h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Link href="/buy" className="flex items-center">
              {t("Buy a Business")}
              <ArrowRight className={`ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 h-4 w-4 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className={`rounded-full h-12 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/50 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Link href="/sell">{t("Sell Your Business")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

