'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, BarChart, Brain, Users, Clock, Lock, Zap } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function FeaturesSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("Features")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className={`text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("For Buyers")}
            </h3>
            <div className="grid gap-6">
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-xl text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <FileText className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Business Information")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Comprehensive details on each listed business")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-xl text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <CheckCircle className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Validation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Verified listings for your peace of mind")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-xl text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <BarChart className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Numbers is Everything")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Detailed financial data and performance metrics")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-xl text-blue-600 dark:text-blue-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Brain className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Powered by AI")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("AI-driven insights and recommendations")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-semibold mb-6 text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("For Sellers")}
            </h3>
            <div className="grid gap-6">
              <Card className="border-l-4 border-orange-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Users className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Reach More People")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Connect with a wide network of potential buyers")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-orange-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Clock className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Sell in a Week")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Streamlined process for quick sales")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-orange-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Lock className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Privacy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t("Confidential listings to protect your business")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-orange-500">
                <CardHeader>
                  <CardTitle className={`flex items-center text-orange-500 dark:text-orange-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Zap className="mr-2 rtl:ml-2 rtl:mr-0" /> {t("Powered by AI")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'font-arabic' : ''}`}>
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

