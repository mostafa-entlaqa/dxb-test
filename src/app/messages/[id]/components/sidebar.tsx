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




const statusColors = {
  New: "bg-blue-500",
  Qualified: "bg-green-500",
  Negotiation: "bg-yellow-500",
  Won: "bg-purple-500",
  Lost: "bg-red-500",
}

export function SidebarClient({ 
  business, 
  buyerStatuses,
  currentUser,
  className 
}: { 
  business: BusinessDetails
  buyerStatuses: BuyerStatus[]
  currentUser: any
  className?: string 
}) {
  const router = useRouter()
  const isOwner = currentUser?.id === business.user_id

  const handleBuyerClick = (buyerId: string) => {
    router.push(`/messages/${business.id}?buyer=${buyerId}`)
  }

  console.log(buyerStatuses)

  return (
    <div className={`bg-muted h-[calc(100vh-4rem)] overflow-hidden ${className}`}>
      <Card className="m-4 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">
            {isOwner ? "Your Business" : "Business Details"}
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
        {isOwner ? "Interested Buyers" : "Your Messages"}
      </div>
      <ScrollArea className="h-[calc(100vh-250px)]">
        {buyerStatuses.map((buyerStatus) => (
          <div 
            key={buyerStatus.id} 
            className="flex items-center p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => handleBuyerClick(buyerStatus.buyer.id)}
          >
            <Avatar className="w-10 h-10 mr-3">
              {buyerStatus.buyer.profile_pic_url ? (
                <Image
                  src={buyerStatus.buyer.profile_pic_url}
                  alt={buyerStatus.buyer.full_name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback>
                  {buyerStatus.buyer.full_name?.[0] || buyerStatus.buyer.email[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="font-medium flex items-center">
                {buyerStatus.buyer.full_name || buyerStatus.buyer.email}
                {buyerStatus.has_unread && (
                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <Badge className={`${statusColors[buyerStatus.status]} text-white`}>
                {buyerStatus.status}
              </Badge>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

