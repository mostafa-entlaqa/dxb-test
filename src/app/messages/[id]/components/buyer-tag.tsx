"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { updateBuyerStatus } from "@/app/actions/messages/update-buyer-status"
import { useRouter } from "next/navigation"

const tags = [
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

interface BuyerTagProps {
  businessId: string
  buyerId: string
}

export function BuyerTag({ businessId, buyerId }: BuyerTagProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Load existing status
  React.useEffect(() => {
    const loadStatus = async () => {
      const { data } = await supabase
        .from('buyer_status')
        .select('status')
        .eq('business_id', businessId)
        .eq('buyer_id', buyerId)
        .single()

      if (data?.status) {
        setValue(data.status)
      }
    }

    loadStatus()
  }, [businessId, buyerId])

  // Update status using server action
  const handleStatusUpdate = async (newValue: string) => {
    try {
      setLoading(true)
      await updateBuyerStatus(businessId, buyerId, newValue)
      setValue(newValue)
      setOpen(false)
      router.refresh() // Refresh the page to show updated status
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open} 
            className="w-[200px] justify-between"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                {value ? tags.find((tag) => tag.value === value)?.label : "Set buyer status..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.value}
                    onSelect={(currentValue) => {
                      handleStatusUpdate(currentValue === value ? "" : currentValue)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === tag.value ? "opacity-100" : "opacity-0")} />
                    {tag.label}
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
