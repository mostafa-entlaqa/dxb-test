'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InsightsSection() {
  // Real UAE market data for 2023-2024
  const insights = {
    growthRate: 5.7,
    startups: 4000,
    investment: 22.1
  }

  const insightCards = [
    {
      icon: <TrendingUp className="w-5 h-5 mr-2" />,
      title: "Growth Rate",
      value: `${insights.growthRate}%`,
      description: "Annual GDP growth rate",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Users className="w-5 h-5 mr-2" />,
      title: "Startups",
      value: `${insights.startups}+`,
      description: "New startups per year",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <DollarSign className="w-5 h-5 mr-2" />,
      title: "Investment",
      value: `$${insights.investment}B`,
      description: "Annual foreign investment",
      color: "text-green-600 dark:text-green-400"
    }
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-12 text-center",
          "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
          "bg-clip-text text-transparent"
        )}>
          UAE Business Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insightCards.map((card, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className={cn("flex items-center justify-center text-2xl", card.color)}>
                  {card.icon}
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn("text-3xl font-bold mb-2", card.color)}>
                  {card.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
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

