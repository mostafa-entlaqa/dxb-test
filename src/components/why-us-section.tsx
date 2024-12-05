'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { Users, Shield, MessageSquare, Scale, Banknote } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WhyUsSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-12 text-center",
          "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
          "bg-clip-text text-transparent",
          language === 'ar' ? 'font-arabic' : ''
        )}>
          {t("Why Choose Us")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={`flex items-center text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Users className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Largest Marketplace")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t("Access the biggest selection of businesses in the UAE")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Shield className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Trusted Sources")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t("All listings are verified and from reliable sources")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={`flex items-center text-green-600 dark:text-green-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <MessageSquare className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Communicate Directly")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t("Connect with buyers or sellers without intermediaries")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={`flex items-center text-purple-600 dark:text-purple-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Scale className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Legal Assistance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t("Get help with legal aspects of buying or selling a business")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={`flex items-center text-red-600 dark:text-red-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Banknote className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Financial Assistance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t("Access financial advice and support for your transaction")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

