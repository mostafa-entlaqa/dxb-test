import { Building2, Users, Trophy, Clock, Shield, Target, Heart, Lightbulb, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    {
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      title: "Business Listed",
      value: "1,000+",
      description: "Active businesses for sale"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Monthly Visitors",
      value: "50,000+",
      description: "Active buyers browsing"
    },
    {
      icon: <Trophy className="h-6 w-6 text-orange-600" />,
      title: "Successful Sales",
      value: "500+",
      description: "Businesses sold through us"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Years of Experience",
      value: "2+",
      description: "In UAE market"
    }
  ]

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Trust & Transparency",
      description: "We believe in complete transparency in all our dealings, ensuring trust between buyers and sellers."
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Results Driven",
      description: "Our focus is on achieving successful outcomes for both buyers and sellers."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Customer First",
      description: "Your success is our priority. We're committed to providing exceptional service."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-600" />,
      title: "Innovation",
      description: "We continuously improve our platform to make business transactions smoother."
    }
  ]

  const testimonials = [
    {
      quote: "SellBusiness.ae made selling my restaurant chain smooth and efficient. Their platform attracted serious buyers quickly.",
      author: "Mohammed Al Rashid",
      position: "Former Owner, Dubai Restaurant Group",
      rating: 5
    },
    {
      quote: "The level of professionalism and support I received was outstanding. Highly recommend their premium service.",
      author: "Sarah Thompson",
      position: "CEO, Tech Solutions LLC",
      rating: 5
    },
    {
      quote: "Found my dream business through their platform. The process was transparent and well-structured.",
      author: "Ahmed Al Mansoori",
      position: "Business Investor",
      rating: 5
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About SellBusiness.ae
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            The leading marketplace for buying and selling businesses in the UAE. 
            We connect serious buyers with verified business sellers to facilitate 
            successful business transactions.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{stat.icon}</div>
                  <CardTitle>{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                Founded in 2019, SellBusiness.ae emerged from a simple observation: 
                the UAE's business marketplace needed a modern, efficient platform 
                to connect serious buyers with verified sellers.
              </p>
              <p className="text-lg mb-4">
                What started as a simple listing platform has evolved into the UAE's 
                most comprehensive business marketplace, featuring advanced tools, 
                secure communication channels, and professional support services.
              </p>
              <p className="text-lg">
                Today, we're proud to be the trusted platform for thousands of 
                entrepreneurs, helping them achieve their business goals through 
                successful acquisitions and exits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              To create the most efficient and transparent marketplace for business 
              transactions in the UAE, enabling entrepreneurs to achieve their goals 
              whether they're looking to sell their business or acquire one.
            </p>
            <p className="text-lg text-muted-foreground">
              We're committed to providing a secure, professional platform that 
              streamlines the business buying and selling process, making it easier 
              for both parties to achieve successful outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.position}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 