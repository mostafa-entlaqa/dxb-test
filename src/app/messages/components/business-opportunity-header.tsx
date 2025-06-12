"use client"

import { Business } from "../[id]/type"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BusinessOpportunityHeaderProps {
  business: Business
  className?: string
}

export function BusinessOpportunityHeader({ business, className }: BusinessOpportunityHeaderProps) {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{business.opportunity_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{business.category.name}</Badge>
            <Badge variant="outline">{business.area.name}</Badge>
            <span className="text-sm text-muted-foreground">
              AED {business.selling_price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 