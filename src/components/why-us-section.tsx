'use client'

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
  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Large Network",
      description: "Access to thousands of verified buyers and sellers across the UAE",
      color: "bg-blue-100 dark:bg-blue-900/50",
      delay: 1
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Secure Process",
      description: "Safe and secure transaction process with verified businesses",
      color: "bg-green-100 dark:bg-green-900/50",
      delay: 2
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      title: "Expert Support",
      description: "Dedicated support team to guide you through the entire process",
      color: "bg-purple-100 dark:bg-purple-900/50",
      delay: 3
    },
    {
      icon: <Scale className="h-6 w-6 text-orange-600" />,
      title: "Fair Valuation",
      description: "Professional business valuation services for accurate pricing",
      color: "bg-orange-100 dark:bg-orange-900/50",
      delay: 4
    },
    {
      icon: <Banknote className="h-6 w-6 text-teal-600" />,
      title: "Flexible Terms",
      description: "Various payment and acquisition options to suit your needs",
      color: "bg-teal-100 dark:bg-teal-900/50",
      delay: 5
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-12 text-center",
          "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600",
          "bg-clip-text text-transparent"
        )}>
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

