'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/utils/supabase-client'

interface Category {
  id: number
  name: string
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getSupabase()
      const { data } = await supabase
        .from('business_categories')
        .select('id, name')
        .order('name')
      
      if (data) setCategories(data)
    }

    fetchCategories()
  }, [])

  const handleSearch = (categoryId: string) => {
    router.push(`/buy?category=${categoryId}`)
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
            Find Your Next Business Opportunity
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover verified businesses for sale in the UAE. Whether you're looking to buy an existing business or sell your own, we're here to help.
          </p>
        </div>

        <Card className="p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <Select onValueChange={handleSearch}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select business category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="lg" className="md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/buy" className="flex items-center">
              Browse All Businesses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/sell" className="flex items-center">
              List Your Business
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

