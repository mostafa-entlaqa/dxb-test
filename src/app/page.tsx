import HeroSection from '@/components/hero-section'
import InsightsSection from '@/components/insights-section'
import FeaturesSection from '@/components/features-section'
import WhyUsSection from '@/components/why-us-section'
import CTABanner from '@/components/cta-banner'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <HeroSection />
      </div>

      {/* Insights with subtle background */}
      <div className="relative bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <InsightsSection />
      </div>

      {/* Features with clean background */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <FeaturesSection />
      </div>

      {/* Why Us with gradient background */}
      <div className="relative bg-white dark:bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50"></div>
        </div>
        <WhyUsSection />
      </div>

      {/* CTA Banner with strong gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900">
        <CTABanner />
      </div>
    </main>
  )
}

