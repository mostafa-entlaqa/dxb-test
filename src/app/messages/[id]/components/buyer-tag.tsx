"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface BuyerTagProps {
  businessId: string
  buyerId: string
  isLoading?: boolean
}

interface BuyerStatus {
  id: string
  status: string
  buyer_id: string
  buyer: {
    id: string
    email: string
    full_name: string | null
  }
}

const statusColors = {
  New: "bg-blue-500",
  Qualified: "bg-green-500",
  Negotiation: "bg-yellow-500",
  Won: "bg-purple-500",
  Lost: "bg-red-500",
} as const

type Status = keyof typeof statusColors

export function BuyerTag({ businessId, buyerId, isLoading = false }: BuyerTagProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [buyers, setBuyers] = React.useState<BuyerStatus[]>([])
  const [selectedBuyer, setSelectedBuyer] = React.useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  React.useEffect(() => {
    const loadBuyers = async () => {
      setLoading(true)
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // First get buyer statuses
        const { data: buyerStatuses } = await supabase
          .from('buyer_status')
          .select('*')
          .eq('business_id', businessId)
          // Filter out the current user (seller)
          .neq('buyer_id', user.id)

        if (buyerStatuses && buyerStatuses.length > 0) {
          // Get user details for all buyers
          const { data: users } = await supabase
            .from('users')
            .select('id, email, full_name')
            .in('id', buyerStatuses.map(status => status.buyer_id))

          if (users) {
            // Map users to their buyer statuses
            const buyersWithDetails = buyerStatuses.map(status => {
              const user = users.find(u => u.id === status.buyer_id)
              return {
                id: status.id,
                status: status.status,
                buyer_id: status.buyer_id,
                buyer: {
                  id: user?.id || status.buyer_id,
                  email: user?.email || '',
                  full_name: user?.full_name
                }
              }
            })
            setBuyers(buyersWithDetails)

            // Set initial selected buyer from URL
            if (buyerId) {
              const currentBuyer = buyersWithDetails.find(b => b.buyer_id === buyerId)
              if (currentBuyer) {
                setSelectedBuyer(currentBuyer.buyer_id)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading buyers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBuyers()
  }, [businessId, buyerId])

  const handleBuyerSelect = (buyerId: string) => {
    setSelectedBuyer(buyerId)
    setOpen(false)
    // Navigate to the selected buyer's chat using their UUID
    router.push(`/messages/${businessId}?buyer=${buyerId}`)
  }

  const currentBuyer = buyers.find(b => b.buyer_id === selectedBuyer)

  return (
    <div className="mb-4 w-full max-w-[300px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open} 
            className="w-full justify-between"
            disabled={loading || isLoading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading buyers...</span>
              </>
            ) : (
              <>
                {currentBuyer ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="truncate">{currentBuyer.buyer.full_name || currentBuyer.buyer.email}</span>
                    <Badge className={cn("ml-auto shrink-0", statusColors[currentBuyer.status as Status])}>
                      {currentBuyer.status}
                    </Badge>
                  </div>
                ) : (
                  "Select buyer..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search buyers..." />
            <CommandList>
              <CommandEmpty>No buyers found.</CommandEmpty>
              <CommandGroup>
                {buyers.map((buyer) => (
                  <CommandItem
                    key={buyer.buyer_id}
                    onSelect={() => handleBuyerSelect(buyer.buyer_id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Check className={cn(
                        "h-4 w-4 shrink-0",
                        selectedBuyer === buyer.buyer_id ? "opacity-100" : "opacity-0"
                      )} />
                      <span className="truncate">{buyer.buyer.full_name || buyer.buyer.email}</span>
                      <Badge className={cn("ml-auto shrink-0", statusColors[buyer.status as Status])}>
                        {buyer.status}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
