import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Percent, Building2, MapPin,  } from 'lucide-react'


import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Link from 'next/link'

export default function BusinessCard({business}: {business: any}) {
  return (
    <Card key={business.id} className={cn("flex flex-col")}>
            <div className="relative h-48">
              <img
                src={business.images?.[0] || '/placeholder-business.jpg'}
                alt={business.opportunity_name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
              />
              {business.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
            </div>
            <CardHeader>
              <CardTitle>{business.opportunity_name}</CardTitle>
              <CardDescription>
                <Building2 className="inline-block w-4 h-4 mr-1" />
                {business.category?.name || 'Uncategorized'}
              </CardDescription>
              <CardDescription>
                <MapPin className="inline-block w-4 h-4 mr-1" />
                {business.area?.name || 'Location not specified'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <DollarSign className="inline-block w-4 h-4 mr-1" />
                  {new Intl.NumberFormat('en-AE', {
                    style: 'currency',
                    currency: 'AED',
                  }).format(business.selling_price)}
                </div>
                <div>
                  <Percent className="inline-block w-4 h-4 mr-1" />
                  {business.profit_margin}%
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/business/${business.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
  )
}
