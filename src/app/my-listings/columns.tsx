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
        id: "actions",
        cell: ({ row }) => (
            <div className="flex space-x-2" >
                <Button variant="outline" size="icon" >
                    <Edit className="h-4 w-4" />
                </Button>
                < Button variant="outline" size="icon" >
                    <Eye className="h-4 w-4" />
                </Button>
                < Button variant="outline" size="icon" >
                    <MessageSquare className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
] 