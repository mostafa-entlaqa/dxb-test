"use client"

import { useState } from "react"
import { MoreHorizontal, Check } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

type BuyerStatus = "New" | "Qualified" | "Negotiation" | "Won" | "Lost"

interface BuyerProps {
  status: {
    id: string
    buyer: {
      profile_pic_url?: string
      full_name?: string
      email: string
    }
    status: BuyerStatus
  }
}

function Buyer({ status }: BuyerProps) {
  const [currentStatus, setCurrentStatus] = useState<BuyerStatus>(status.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClientComponentClient()

  const statusColors = {
    New: "bg-blue-500",
    Qualified: "bg-green-500",
    Negotiation: "bg-yellow-500",
    Won: "bg-purple-500",
    Lost: "bg-red-500",
  }

  const updateStatus = async (newStatus: BuyerStatus) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)

    try {
      const { error } = await supabase.from("buyer_status").update({ status: newStatus }).eq("id", status.id)

      if (error) throw error

        setCurrentStatus(newStatus)
        toast({
            title: `Status updated to ${newStatus}`,
            description: 'Buyer status updated successfully',
            variant: 'default',
        })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Failed to update status",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
    <div className="flex  w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="w-10 h-10 mr-3 border overflow-hidden">
        {status.buyer.profile_pic_url ? (
          <AvatarImage src={status.buyer.profile_pic_url} alt={status.buyer.full_name || status.buyer.email} />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            {(status.buyer.full_name?.[0] || status.buyer.email[0]).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="font-medium">{status.buyer.full_name || status.buyer.email}</div>
        <Badge className={`${statusColors[currentStatus]} text-white font-medium px-2.5 py-0.5`}>{currentStatus}</Badge>
      </div>

    
    </div>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-secondary h-8 w-8 p-0 rounded-full"
            disabled={isUpdating}
          >
            <MoreHorizontal className="h-4 w-4 mb-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent  className="w-48" align="end">
          <DropdownMenuLabel className="text-center font-medium">Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {(Object.keys(statusColors) as BuyerStatus[]).map((statusOption) => (
            <DropdownMenuItem
              key={statusOption}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => updateStatus(statusOption)}
              disabled={isUpdating}
            >
              <Badge className={`${statusColors[statusOption]} text-white hover:text-black`}>{statusOption}</Badge>
              {currentStatus === statusOption && <Check className="h-4 w-4 text-primary " />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Buyer

