'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BusinessDetails, BuyerStatus } from '../type'
import Buyer from './buyer'
import { BuyerTag } from './buyer-tag'

export function SidebarClient({ 
  business, 
  buyerStatuses,
  currentUser,
  className,
  isBuyerView = false
}: { 
  business: BusinessDetails
  buyerStatuses: any[]
  currentUser: any
  className?: string
  isBuyerView?: boolean
}) {
  const router = useRouter()
  const [filteredBuyers, setFilteredBuyers] = useState(buyerStatuses)

  const handleFilterChange = (status: string | null) => {
    if (status) {
      const filtered = buyerStatuses.filter(
        buyer => buyer.status.toLowerCase() === status.toLowerCase()
      )
      setFilteredBuyers(filtered)
    } else {
      setFilteredBuyers(buyerStatuses)
    }
  }

  // Reset filtered buyers when buyerStatuses changes
  useEffect(() => {
    setFilteredBuyers(buyerStatuses)
  }, [buyerStatuses])

  const handleClick = (id: string) => {
    if (isBuyerView) {
      router.push(`/messages/${id}`)
    } else {
      router.push(`/messages/${business.id}?buyer=${id}`)
    }
  }

  return (
    <div className={`bg-muted h-[calc(100vh-4rem)] flex flex-col ${className}`}>
      <Card className="m-4 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">
            {isBuyerView ? "Your Conversations" : "Business Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm">
          <p><strong>Name:</strong> {business.opportunity_name}</p>
          <p><strong>Category:</strong> {business.category?.name}</p>
          <p><strong>Location:</strong> {business.area?.name}</p>
          <p>
            <strong>Price:</strong> {new Intl.NumberFormat('en-AE', {
              style: 'currency',
              currency: 'AED'
            }).format(business.selling_price)}
          </p>
        </CardContent>
      </Card>

      <div className="px-4 py-2 font-semibold">
        {isBuyerView ? "Your Conversations" : "Interested Buyers"}
      </div>

      <ScrollArea className="flex-1 max-h-[calc(100vh-12rem)] overflow-auto">
        {filteredBuyers.map((status) => (
          <div 
            key={status.id} 
            className="flex items-center p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => handleClick(isBuyerView ? status.business_id : status.buyer.id)}
          >
            {isBuyerView ? (
              <div className="flex-1">
                <div className="font-medium">{status.business.opportunity_name}</div>
                <div className="text-sm text-muted-foreground">
                  {status.business.category?.name} • {status.business.area?.name}
                </div>
              </div>
            ) : (
              <Buyer status={status} />
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default SidebarClient
