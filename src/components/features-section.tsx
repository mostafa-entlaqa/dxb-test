'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, BarChart, Brain, Users, Clock, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
  const buyerFeatures = [
    {
      id: 'b1',
      icon: <FileText className="h-6 w-6 mr-3" />,
      title: "Business Information",
      description: "Comprehensive details on each listed business",
      size: "large"
    },
    {
      id: 'b2',
      icon: <CheckCircle className="h-5 w-5 mr-2" />,
      title: "Validation",
      description: "Verified listings for your peace of mind",
      size: "small"
    },
    {
      id: 'b3',
      icon: <BarChart className="h-5 w-5 mr-2" />,
      title: "Numbers is Everything",
      description: "Detailed financial data and performance metrics",
      size: "small"
    },
    {
      id: 'b4',
      icon: <Brain className="h-5 w-5 mr-2" />,
      title: "Powered by AI",
      description: "AI-driven insights and recommendations",
      size: "small"
    }
  ]

  const sellerFeatures = [
    {
      id: 's1',
      icon: <Users className="h-6 w-6 mr-3" />,
      title: "Reach More People",
      description: "Connect with a wide network of potential buyers",
      size: "large"
    },
    {
      id: 's2',
      icon: <Clock className="h-5 w-5 mr-2" />,
      title: "Sell in a Week",
      description: "Streamlined process for quick sales",
      size: "small"
    },
    {
      id: 's3',
      icon: <Lock className="h-5 w-5 mr-2" />,
      title: "Privacy",
      description: "Confidential listings to protect your business",
      size: "small"
    },
    {
      id: 's4',
      icon: <Sparkles className="h-5 w-5 mr-2" />,
      title: "AI Assistance",
      description: "AI-assisted valuation and listing optimization",
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
          color.replace('border', 'text')
        )}>
          {feature.icon} {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(
          feature.size === "large" ? "text-lg" : "text-base",
          "text-gray-600 dark:text-gray-300"
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
          "bg-clip-text text-transparent"
        )}>
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-blue-600 dark:text-blue-400"
            )}>
              For Buyers
            </h3>
            <div className="grid gap-6">
              {buyerFeatures.map((feature) => (
                <div key={feature.id}>
                  {renderFeatureCard(feature, 'border-blue-500')}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-semibold mb-8",
              "text-orange-500 dark:text-orange-400"
            )}>
              For Sellers
            </h3>
            <div className="grid gap-6">
              {sellerFeatures.map((feature) => (
                <div key={feature.id}>
                  {renderFeatureCard(feature, 'border-orange-500')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

