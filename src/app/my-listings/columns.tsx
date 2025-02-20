'use client'
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MessageSquare } from "lucide-react"
import { format } from 'date-fns'
import { getClientSupabase } from '@/lib/supabase/utils'
import PublishStatusToggle from './PublishStatusToggle'

// Define the type for each column
export type BusinessTypeCol = {
    id: string
    images: string[]
    opportunity_name: string
    form_status: string
    approve: string;
    user_id: string
    views_count: number
}

// Function to toggle publish status
// Define the columns with explicit types
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
                className="rounded-md"

            />
        ),
    },
    {
        accessorKey: "opportunity_name",
        header: "Business Name",
    },
    {
        accessorKey: "approve",
        header: "Publish Date",
        cell: ({ row }) => (
            <div className="flex items-center space-x-2" >
                {!row.original.approve ? "-" : format(new Date(row.original.approve), 'yyyy/MM/dd')}
            </div>
        ),
    },
    {
        accessorKey: "form_status",
        header: "Publish Status",
        cell: ({ row }) => (
            <PublishStatusToggle
                approve={row.original.approve}
                id={row.original.id}
                currentStatus={row.original.form_status}
                onStatusChange={(newStatus) => {
                    console.log(`Status changed to: ${newStatus}`);
                }}
            />
        ),
    },
    {
        accessorKey: "views_count",
        header: "Views",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
               <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{row.original.views_count || 0}</span>
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-secondary"
                    title="Edit listing"
                >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-secondary"
                    title="View details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                    </svg>
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-secondary"
                    title="Messages"
                >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        ),
    },
] 