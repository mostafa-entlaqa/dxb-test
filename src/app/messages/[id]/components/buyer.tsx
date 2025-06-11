"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

  const statusConfig = {
    New: {
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
      activeColor: "bg-blue-700 text-white dark:bg-blue-600",
      icon: "🔵",
    },
    Qualified: {
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800/50",
      activeColor: "bg-emerald-700 text-white dark:bg-emerald-600",
      icon: "✅",
    },
    Negotiation: {
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-800/50",
      activeColor: "bg-amber-700 text-white dark:bg-amber-600",
      icon: "🤝",
    },
    Won: {
      color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
      hoverColor: "hover:bg-violet-200 dark:hover:bg-violet-800/50",
      activeColor: "bg-violet-700 text-white dark:bg-violet-600",
      icon: "🏆",
    },
    Lost: {
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
      hoverColor: "hover:bg-rose-200 dark:hover:bg-rose-800/50",
      activeColor: "bg-rose-700 text-white dark:bg-rose-600",
      icon: "❌",
    },
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
        description: "Buyer status updated successfully",
        variant: "default",
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

  // Extract initials from name or email
  const getInitials = () => {
    if (status.buyer.full_name) {
      return status.buyer.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return status.buyer.email[0].toUpperCase()
  }

  return (
    <div className="flex items-center w-full">
      <Avatar className="h-10 w-10 border shadow-sm flex-shrink-0">
        {status.buyer.profile_pic_url ? (
          <AvatarImage
            src={status.buyer.profile_pic_url || "/placeholder.svg"}
            alt={status.buyer.full_name || status.buyer.email}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials()}</AvatarFallback>
        )}
      </Avatar>

      <div className="ml-3 flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{status.buyer.full_name || status.buyer.email}</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUpdating}>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 py-0.5 h-auto mt-1 ${statusConfig[currentStatus].color} ${statusConfig[currentStatus].hoverColor} border-0 shadow-none font-normal text-xs`}
            >
              <span className="mr-1">{statusConfig[currentStatus].icon}</span>
              {currentStatus}
              <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 p-1">
            {(Object.keys(statusConfig) as BuyerStatus[]).map((statusOption) => (
              <DropdownMenuItem
                key={statusOption}
                className={`flex items-center px-2 py-1.5 my-0.5 rounded-md cursor-pointer text-sm ${
                  currentStatus === statusOption
                    ? statusConfig[statusOption].activeColor
                    : `${statusConfig[statusOption].color} ${statusConfig[statusOption].hoverColor}`
                }`}
                onClick={() => updateStatus(statusOption)}
                disabled={isUpdating || currentStatus === statusOption}
              >
                <span className="mr-2">{statusConfig[statusOption].icon}</span>
                {statusOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Buyer
