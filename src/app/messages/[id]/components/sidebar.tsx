"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import type { BusinessDetails } from "../type"
import Buyer from "./buyer"
import { Building2, MapPin, DollarSign, Users, MessageCircle } from "lucide-react"

export function SidebarClient({
  business,
  buyerStatuses,
  currentUser,
  className,
  isBuyerView = false,
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
      const filtered = buyerStatuses.filter((buyer) => buyer.status.toLowerCase() === status.toLowerCase())
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
    <div className={`bg-background border-r h-[calc(100vh-4rem)] flex flex-col ${className}`}>
      {/* Business Details Card */}
      <div className="p-6 border-b bg-muted/30">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-none">
                {isBuyerView ? "Your Conversations" : "Business Details"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isBuyerView ? "Manage your active conversations" : "Overview of your listing"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground leading-relaxed">{business.opportunity_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {business.category?.name}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{business.area?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat("en-AE", {
                  style: "currency",
                  currency: "AED",
                }).format(business.selling_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="px-6 py-4 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-md">
            {isBuyerView ? (
              <MessageCircle className="h-4 w-4 text-primary" />
            ) : (
              <Users className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{isBuyerView ? "Active Conversations" : "Interested Buyers"}</h3>
            <p className="text-xs text-muted-foreground">
              {filteredBuyers.length} {filteredBuyers.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>
        </div>
      </div>

      {/* Buyers/Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredBuyers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-3 bg-muted rounded-full mb-4">
                {isBuyerView ? (
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <Users className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h4 className="font-medium text-sm mb-1">
                {isBuyerView ? "No conversations yet" : "No interested buyers yet"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isBuyerView
                  ? "Your conversations will appear here"
                  : "Buyers will appear here when they show interest"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredBuyers.map((status, index) => (
                <div
                  key={status.id}
                  className={`group relative rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                    isBuyerView && business.id === status.business_id
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "bg-card hover:bg-muted/50 border-border hover:border-border/80"
                  }`}
                  onClick={() => handleClick(isBuyerView ? status.business_id : status.buyer.id)}
                >
                  <div className="p-4">
                    {isBuyerView ? (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-relaxed line-clamp-2">
                            {status.business.opportunity_name}
                          </h4>
                          <div className="flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{status.business.category?.name}</span>
                          <span>•</span>
                          <span>{status.business.area?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <Buyer status={status} />
                    )}
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default SidebarClient
