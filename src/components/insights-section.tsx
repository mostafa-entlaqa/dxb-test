'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function InsightsSection() {
  const { t, language } = useLanguage()

  // Real UAE market data for 2023-2024
  const insights = {
    growthRate: 5.7,
    startups: 4000,
    investment: 22.1
  }

  const insightCards = [
    {
      icon: <TrendingUp className={cn("w-5 h-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Growth Rate"),
      value: `${insights.growthRate}%`,
      description: t("Annual GDP growth rate"),
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Users className={cn("w-5 h-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Startups"),
      value: `${insights.startups}+`,
      description: t("New startups per year"),
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <DollarSign className={cn("w-5 h-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Investment"),
      value: `$${insights.investment}B`,
      description: t("Annual foreign investment"),
      color: "text-green-600 dark:text-green-400"
    }
  ]

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
          {insightCards.map((card, index) => (
            <Card 
              key={index} 
              className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className={cn(
                  "flex items-center text-xl font-semibold",
                  card.color,
                  language === 'ar' ? 'font-arabic flex-row-reverse' : ''
                )}>
                  {card.icon} {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                language === 'ar' ? 'text-right' : ''
              )}>
                <p className={cn(
                  "text-4xl font-bold text-gray-900 dark:text-white mb-2",
                  language === 'ar' ? 'font-arabic' : ''
                )}>
                  {language === 'ar' ? card.value.replace('$', '') + ' دولار' : card.value}
                </p>
                <p className={cn(
                  "text-base text-gray-600 dark:text-gray-300",
                  language === 'ar' ? 'font-arabic' : ''
                )}>
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

