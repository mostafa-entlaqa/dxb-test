'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function InsightsSection() {
  const { t, language } = useLanguage()

  // Real UAE market data for 2023-2024
  const insights = {
    growthRate: 5.7, // UAE GDP growth rate for 2024 (IMF forecast)
    startups: 4000, // Approximate new business licenses in Dubai for 2023
    investment: 22.1 // FDI inflow in billions USD for 2023
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-12 text-center",
          "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
          "bg-clip-text text-transparent",
          language === 'ar' ? 'font-arabic' : ''
        )}>
          {t("UAE Business Insights")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center text-xl font-semibold",
                "text-blue-600 dark:text-blue-400",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                <TrendingUp className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Growth Rate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{insights.growthRate}%</p>
              <p className={cn(
                "text-base text-gray-600 dark:text-gray-300",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                {t("Annual GDP growth rate")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center text-xl font-semibold",
                "text-orange-500 dark:text-orange-400",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                <Users className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Startups")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{insights.startups}+</p>
              <p className={cn(
                "text-base text-gray-600 dark:text-gray-300",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                {t("New startups per year")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center text-xl font-semibold",
                "text-green-600 dark:text-green-400",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                <DollarSign className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Investment")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">${insights.investment}B</p>
              <p className={cn(
                "text-base text-gray-600 dark:text-gray-300",
                language === 'ar' ? 'font-arabic' : ''
              )}>
                {t("Annual foreign investment")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

