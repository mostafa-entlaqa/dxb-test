'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function InsightsSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("UAE Business Insights")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle className={`flex items-center text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <TrendingUp className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Growth Rate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800 dark:text-white">7.4%</p>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Annual GDP growth rate")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <Users className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Startups")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800 dark:text-white">350+</p>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>{t("New startups per year")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle className={`flex items-center text-green-600 dark:text-green-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <DollarSign className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Investment")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800 dark:text-white">$1.5B</p>
              <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Annual foreign investment")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

