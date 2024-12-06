'use client'

import { useLanguage } from '@/components/language-provider'
import { Users, Shield, MessageSquare, Scale, Banknote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}

const FeatureCard = ({ icon, title, description, color, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    viewport={{ once: true }}
    className="relative group"
  >
    <div className={cn(
      "p-6 rounded-xl bg-white dark:bg-gray-800",
      "border border-gray-100 dark:border-gray-700",
      "transform transition-all duration-300",
      "hover:shadow-xl hover:-translate-y-1",
      "dark:shadow-none"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
        "transform transition-transform group-hover:scale-110",
        color
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  </motion.div>
)

export default function WhyUsSection() {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: t("Largest Marketplace"),
      description: t("Access the biggest selection of businesses in the UAE"),
      color: "bg-blue-600 dark:bg-blue-500",
      delay: 1
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: t("Trusted Sources"),
      description: t("All listings are verified and from reliable sources"),
      color: "bg-orange-500 dark:bg-orange-400",
      delay: 2
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: t("Communicate Directly"),
      description: t("Connect with buyers or sellers without intermediaries"),
      color: "bg-green-500 dark:bg-green-400",
      delay: 3
    },
    {
      icon: <Scale className="w-6 h-6 text-white" />,
      title: t("Legal Assistance"),
      description: t("Get help with legal aspects of buying or selling a business"),
      color: "bg-purple-500 dark:bg-purple-400",
      delay: 4
    },
    {
      icon: <Banknote className="w-6 h-6 text-white" />,
      title: t("Financial Assistance"),
      description: t("Access financial advice and support for your transaction"),
      color: "bg-red-500 dark:bg-red-400",
      delay: 5
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className={cn(
            "text-4xl font-bold mb-4",
            "text-gray-900 dark:text-white",
            language === 'ar' ? 'font-arabic' : ''
          )}>
            {t("Why Choose Us")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t("Discover why businesses trust us for their buying and selling needs")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

