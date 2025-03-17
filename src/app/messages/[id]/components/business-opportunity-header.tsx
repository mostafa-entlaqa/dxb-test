'use client'

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface BusinessDetails {
  id: string
  opportunity_name: string
  selling_price: number
  category: { name: string }
  area: { name: string }
  images?: string[] // Array of image URLs
}

export function BusinessOpportunityHeader({ 
  business, 
  className 
}: { 
  business: BusinessDetails
  className?: string 
}) {
  const supabase = createClientComponentClient()

  // Debug logs




  return (
    <Card className={`${className} shadow-none rounded-none`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {business.images && business.images.length > 0 ? (
            <div className="w-[200px] h-[150px] relative">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {business.images.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[150px]">
                        <Image
                          src={url}
                          alt={`${business.opportunity_name} image ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" />
              </Carousel>
            </div>
          ) : (
            <Image
              src="/placeholder.svg"
              alt="Business image"
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">{business.opportunity_name}</h1>
            <p className="text-muted-foreground">{business.category?.name} • {business.area?.name}</p>
            <p className="text-lg font-semibold text-primary">
              {new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: 'AED'
              }).format(business.selling_price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

