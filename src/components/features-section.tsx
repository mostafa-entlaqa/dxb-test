'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { FileText, CheckCircle, BarChart, Brain, Users, Clock, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
  const { t, language } = useLanguage()

  const buyerFeatures = [
    {
      icon: <FileText className={cn("h-6 w-6", language === 'ar' ? 'ml-3' : 'mr-3')} />,
      title: t("Business Information"),
      description: t("Comprehensive details on each listed business"),
      size: "large"
    },
    {
      icon: <CheckCircle className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Validation"),
      description: t("Verified listings for your peace of mind"),
      size: "small"
    },
    {
      icon: <BarChart className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Numbers is Everything"),
      description: t("Detailed financial data and performance metrics"),
      size: "small"
    },
    {
      icon: <Brain className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Powered by AI"),
      description: t("AI-driven insights and recommendations"),
      size: "small"
    }
  ]

  const sellerFeatures = [
    {
      icon: <Users className={cn("h-6 w-6", language === 'ar' ? 'ml-3' : 'mr-3')} />,
      title: t("Reach More People"),
      description: t("Connect with a wide network of potential buyers"),
      size: "large"
    },
    {
      icon: <Clock className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Sell in a Week"),
      description: t("Streamlined process for quick sales"),
      size: "small"
    },
    {
      icon: <Lock className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("Privacy"),
      description: t("Confidential listings to protect your business"),
      size: "small"
    },
    {
      icon: <Sparkles className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />,
      title: t("AI Assistance"),
      description: t("AI-assisted valuation and listing optimization"),
      size: "small"
    }
  ]

  const renderFeatureCard = (feature: any, color: string) => (
    <Card className={`border-l-4 ${color} hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center",
          feature.size === "large" ? "text-xl md:text-2xl" : "text-lg",
          "font-semibold",
          color.replace('border', 'text'),
          language === 'ar' ? 'font-arabic flex-row-reverse' : ''
        )}>
          {feature.icon} {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(
          feature.size === "large" ? "text-lg" : "text-base",
          "text-gray-600 dark:text-gray-300",
          language === 'ar' ? 'font-arabic text-right' : ''
        )}>
          {feature.description}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-12 text-center",
          "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
          "bg-clip-text text-transparent",
          language === 'ar' ? 'font-arabic' : ''
        )}>
          {t("Features")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-blue-600 dark:text-blue-400",
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              {t("For Buyers")}
            </h3>
            <div className="grid gap-6">
              {buyerFeatures.map((feature, index) => (
                renderFeatureCard(feature, 'border-blue-500')
              ))}
            </div>
          </div>

          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-orange-500 dark:text-orange-400",
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              {t("For Sellers")}
            </h3>
            <div className="grid gap-6">
              {sellerFeatures.map((feature, index) => (
                renderFeatureCard(feature, 'border-orange-500')
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

