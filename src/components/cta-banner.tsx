'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  const { t, language } = useLanguage()

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className={`text-3xl font-bold mb-4 text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("Ready to Start Your Business Journey?")}
        </h2>
        <p className={`text-xl mb-8 text-white/90 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("Whether you're looking to buy or sell, we're here to help you succeed.")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button asChild size="lg" className={`rounded-full h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Link href="/buy" className="flex items-center">
              {t("Find a Business")}
              <ArrowRight className={`ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </Button>
          <Button asChild size="lg" className={`rounded-full h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Link href="/sell" className="flex items-center">
              {t("List Your Business")}
              <ArrowRight className={`ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

