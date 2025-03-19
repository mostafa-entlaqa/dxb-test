'use client'
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MessageSquare, TrendingUp, UserRoundCheck, Bell } from "lucide-react"
import { format } from 'date-fns'
import { getClientSupabase } from '@/lib/supabase/utils'
import PublishStatusToggle from './PublishStatusToggle'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Crown } from "lucide-react"
import { BusinessActionsMenu } from "./components/BusinessActionsMenu"
import { toast } from "@/components/ui/use-toast"

// Define the type for each column
export type BusinessTypeCol = {
  id: string
  images: string[]

  opportunity_name: string
  form_status: string
  approve_status: string
  approveAt: string;
  user_id: string
  views_count: number
  featured: boolean
  featured_at?: string
  user_messages_count: number
}

// Function to toggle publish status
// Define the columns with explicit types
const handleUpgrade = async (businessId: string) => {
  try {
    const response = await fetch('/api/business/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ businessId }),
    });

    const data = await response.json();

    if (data.error) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive"
      });
      return;
    }

    if (data.url) {
      // Store the current page URL in localStorage before redirecting
      localStorage.setItem('returnToPage', '/my-listings');
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    toast({
      title: "Error",
      description: "Failed to start upgrade process. Please try again.",
      variant: "destructive"
    });
  }
};

export const columns: ColumnDef<BusinessTypeCol>[] = [
  {
    accessorKey: "images",
    header: "Photo",
    cell: ({ row }) => (
      <Image
        src={row.original.images[0] || "/placeholder.svg"}
        alt={row.original.opportunity_name}
        width={60}
        height={60}
        className="rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "opportunity_name",
    header: "Business Name",
    cell: ({ row }) => <div className="font-medium">{row.original.opportunity_name}</div>,
  },
  {
    accessorKey: "approve_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.approve_status
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

      const statusStyles =
        {
          pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
          approved: "bg-green-100 text-green-800 hover:bg-green-100",
          rejected: "bg-red-100 text-red-800 hover:bg-red-100",
          cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        }[status.toLowerCase()] || "bg-gray-100 text-gray-800"

      return (
        <Badge className={statusStyles} variant="outline">
          {capitalizedStatus}
        </Badge>
      )
    },
  },
  {
    accessorKey: "approveAt",
    header: "Publish Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {!row.original.approveAt ? "-" : format(new Date(row.original.approveAt), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "form_status",
    header: "Publish Status",
    cell: ({ row }) => (
      <PublishStatusToggle
        approve={row.original.approve_status}
        id={row.original.id}
        currentStatus={row.original.form_status}
        onStatusChange={(newStatus) => {
          console.log(`Status changed to: ${newStatus}`)
        }}
      />
    ),
  },
  {
    accessorKey: "views_count",
    header: "Views",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <span>{row.original.views_count.toLocaleString() || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: "user_messages_count",
    header: "Users",
    cell: ({ row }) => (
      <div className="flex text-center  items-center gap-2 text-sm">
        <UserRoundCheck className="h-4 w-4 text-blue-500" />
        <span>{row.original.user_messages_count.toLocaleString() || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: "featured",
    header: "Plan",
    cell: ({ row }) => {
      const isFeatured = row.original.featured
      return isFeatured ? (
        <Badge
          className="bg-purple-100 text-purple-800 hover:bg-purple-100 gap-1"
          variant="outline"
        >
          <Crown className="h-3 w-3" />
          Upgrade
        </Badge>
      ) : (
        <Badge
          className="bg-gray-100 text-gray-600 hover:bg-gray-100"
          variant="outline"
        >
          Basic
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <BusinessActionsMenu
          ApproveStatus={row.original.approve_status}
          businessId={row.original.id}
          isFeatured={row.original.featured}
          onUpgrade={handleUpgrade}
        />
      )
    },
  },
] 