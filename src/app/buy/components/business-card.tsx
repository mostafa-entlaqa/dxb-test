import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Percent, Building2, MapPin, Calendar } from 'lucide-react'


import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BusinessCard({business}: {business: any}) {
  return (
    <Card key={business.id} className={cn("flex flex-col", business.featured && "ring-2 ")}>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                  <h4 className="text-sm font-semibold">Price</h4>
                    <DollarSign className="inline-block w-4 h-4 mr-1" />
                    {new Intl.NumberFormat('en-AE', {
                      style: 'currency',
                      currency: 'AED',
                    }).format(business.selling_price)}
                  </div>
                  <div>
                  <h4 className="text-sm font-semibold">Profit Margin</h4>
                  <Percent className="inline-block w-4 h-4 mr-1" />
                  {business.profit_margin}%
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Listed {new Date(business.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/buy/${business.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
  )
}
