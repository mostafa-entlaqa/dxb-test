'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { FileText, CheckCircle, BarChart, Brain, Users, Clock, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
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
          {t("Features")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Buyers */}
          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-blue-600 dark:text-blue-400",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("For Buyers")}
            </h3>
            <div className="grid gap-6">
              <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-xl md:text-2xl font-semibold",
                    "text-blue-600 dark:text-blue-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <FileText className="mr-3 rtl:ml-3 rtl:mr-0 h-6 w-6" />
                    {t("Business Information")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-lg text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Comprehensive details on each listed business")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-blue-600 dark:text-blue-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <CheckCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("Validation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Verified listings for your peace of mind")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-blue-600 dark:text-blue-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <BarChart className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("Numbers is Everything")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Detailed financial data and performance metrics")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-blue-600 dark:text-blue-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <Brain className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("Powered by AI")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("AI-driven insights and recommendations")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-orange-500 dark:text-orange-400",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("For Sellers")}
            </h3>
            <div className="grid gap-6">
              <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-xl md:text-2xl font-semibold",
                    "text-orange-500 dark:text-orange-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <Users className="mr-3 rtl:ml-3 rtl:mr-0 h-6 w-6" />
                    {t("Reach More People")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-lg text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Connect with a wide network of potential buyers")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-orange-500 dark:text-orange-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <Clock className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("Sell in a Week")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Streamlined process for quick sales")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-orange-500 dark:text-orange-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <Lock className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("Privacy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("Confidential listings to protect your business")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={cn(
                    "flex items-center text-lg font-semibold",
                    "text-orange-500 dark:text-orange-400",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    <Sparkles className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                    {t("AI Assistance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-base text-gray-600 dark:text-gray-300",
                    language === 'ar' ? 'font-arabic' : ''
                  )}>
                    {t("AI-assisted valuation and listing optimization")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

