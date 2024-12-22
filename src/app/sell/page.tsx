import { ArrowRight, MessageCircle, Store, Megaphone, Bell, Users, FileCheck, MessageSquare, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SellPage() {
  const features = [
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "Direct Buyer Interaction",
      description: "Connect and communicate directly with qualified buyers, streamlining the selling process."
    },
    {
      icon: <Store className="h-6 w-6 text-primary" />,
      title: "Specialized Marketplace",
      description: "Unlike general marketplaces, we focus solely on business sales, attracting serious buyers."
    },
    {
      icon: <Megaphone className="h-6 w-6 text-primary" />,
      title: "Social Media Promotion",
      description: "Your listing gets promoted across major social platforms to reach potential buyers."
    },
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: "Instant Notifications",
      description: "Stay updated with real-time notifications about buyer interests and inquiries."
    }
  ]

  const crmFeatures = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Buyer Tracking System",
      description: "Monitor potential buyers through every stage of the sales process."
    },
    {
      icon: <FileCheck className="h-6 w-6 text-green-600" />,
      title: "Document Management",
      description: "Streamlined system for sharing and managing due diligence documents."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      title: "Feedback Management",
      description: "Receive and track buyer feedback to optimize your listing and approach."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sell your business 90% faster
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Time is money! Don't let your business sale drag on for months.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/list-business" className="flex items-center">
              List Your Business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Sell With Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CRM Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced CRM System
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {crmFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 relative flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Free Listing</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-3xl font-bold mb-6">
                  AED 0
                  <span className="text-base font-normal text-muted-foreground ml-1">/ listing</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "List your business",
                    "Connect with buyers directly",
                    "Communicate over messenger",
                    "Send & receive documents"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                >
                  <Link href="/sell/create" className="flex items-center justify-center">
                    Create Free Listing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-primary relative flex flex-col">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm rounded-bl-lg">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional Listing</CardTitle>
                <CardDescription>For serious sellers</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-3xl font-bold mb-6">
                  AED 1,499
                  <span className="text-base font-normal text-muted-foreground ml-1">/ listing</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "All Free Listing features",
                    "Featured Ad for One Month",
                    "Promoted on Social Media",
                    "Hands-on support",
                    "Organized buyers & CRM tracking"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full"
                >
                  <Link href="/sell/create?plan=pro" className="flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Sell Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful business sellers on UAE's leading marketplace
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/sell" className="flex items-center">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}