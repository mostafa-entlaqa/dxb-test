'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateBusinessStatus, updateBusinessFeatured } from "@/actions/admin/businesses"
import { toast } from "sonner"
import { format } from "date-fns"

export type Business = {
    id: string
    name: string
    acquisition_type: 'Invest' | 'Buy'
    Featured: boolean
    images: string[]
    files: string[]
    form_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'closed'
    session_id?: string
    opportunity_description?: string
    investment_percentage?: number
    approveAt?: string | null
    approve_status?: string
    subscription_end_date?: string | null
    created_at: string
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return "bg-yellow-50 text-yellow-700 border-yellow-200"
        case 'approved':
            return "bg-green-50 text-green-700 border-green-200"
        case 'rejected':
            return "bg-red-50 text-red-700 border-red-200"
        case 'cancelled':
            return "bg-gray-50 text-gray-700 border-gray-200"
        case 'closed':
            return "bg-blue-50 text-blue-700 border-blue-200"
        default:
            return "bg-gray-50 text-gray-700 border-gray-200"
    }
}

export const columns: ColumnDef<Business>[] = [
    {
        accessorKey: "id",
        header: "ID",
        size: 80,
    },
    {
        accessorKey: "images",
        header: "Image",
        size: 60,
        cell: ({ row }) => {
            const images = row.getValue("images") as string[]
            return images && images[0] ? (
                <img
                    src={images[0]}
                    alt={row.getValue("name")}
                    className="w-10 h-10 object-cover rounded-md"
                />
            ) : (
                <span className="text-muted-foreground">No image</span>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Business Name",
    },
    {
        accessorKey: "acquisition_type",
        header: "Type",
        cell: ({ row }) => {
            return (
                <Badge variant="secondary">
                    {row.getValue("acquisition_type") === 'Invest' ? 'Invest' : 'Buy'}
                </Badge>
            )
        },
    },
    {
        accessorKey: "investment_percentage",
        header: "Investment %",
        size: 100,
        cell: ({ row }) => {
            const percentage = row.getValue("investment_percentage") as number
            return percentage ? `${percentage}%` : '-'
        },
    },
    {
        accessorKey: "Featured",
        header: "Featured",
        size: 100,
        cell: ({ row }) => {
            const featured = row.original.Featured
            const business = row.original

            const toggleFeatured = async () => {
                try {
                    await updateBusinessFeatured(business.id, !featured)
                    toast.success(`Business ${featured ? 'unfeatured' : 'featured'} successfully`)
                } catch (error) {
                    toast.error('Failed to update featured status')
                }
            }

            return (
                <Button
                    variant="ghost"
                    onClick={toggleFeatured}
                    className={featured ? "text-green-600" : "text-muted-foreground"}
                >
                    {featured ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                            Featured
                        </Badge>
                    ) : (
                        <Badge variant="outline">Not Featured</Badge>
                    )}
                </Button>
            )
        },
    },
    {
        accessorKey: "opportunity_description",
        header: "Description",
        cell: ({ row }) => {
            const desc = row.getValue("opportunity_description") as string
            return desc ? (
                <div className="max-w-[300px] truncate" title={desc}>
                    {desc}
                </div>
            ) : '-'
        },
    },

    {
        accessorKey: "form_status",
        header: "Status",
        cell: ({ row }) => {
            const formStatus = row.getValue("form_status") as string
            return (
                <Badge
                    variant="outline"
                    className={getStatusColor(formStatus)}
                >
                    {formStatus.charAt(0).toUpperCase() + formStatus.slice(1)}
                </Badge>
            )
        },
    },

    {
        accessorKey: "approveAt",
        header: "Approved Date",
        cell: ({ row }) => {
            const date = row.getValue("approveAt") as string
            return date ? format(new Date(date), 'MMM dd, yyyy') : '-'
        },
    },
    {
        accessorKey: "subscription_end_date",
        header: "Sub. End Date",
        cell: ({ row }) => {
            const date = row.getValue("subscription_end_date") as string
            return date ? (
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(date), 'MMM dd, yyyy')}
                </div>
            ) : '-'
        },
    },

    {
        id: "actions",
        size: 60,
        cell: ({ row }) => {
            const business = row.original
            const currentStatus = business.approve_status

            const handleStatusUpdate = async (newStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'closed') => {
                try {
                    await updateBusinessStatus(business.id, newStatus)
                    toast.success(`Business ${newStatus} successfully`)
                } catch (error) {
                    toast.error(`Failed to ${newStatus} business`)
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={`/buy/${business.id}`}>View Details</a>
                        </DropdownMenuItem>
                        {currentStatus !== 'approved' && (
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('approved')}
                                className="text-green-600"
                            >
                                Approve
                            </DropdownMenuItem>
                        )}
                        {currentStatus !== 'rejected' && (
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('rejected')}
                                className="text-red-600"
                            >
                                Reject
                            </DropdownMenuItem>
                        )}
                        {currentStatus !== 'pending' && (
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('pending')}
                                className="text-yellow-600"
                            >
                                Set as Pending
                            </DropdownMenuItem>
                        )}
                        {currentStatus !== 'cancelled' && (
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('cancelled')}
                                className="text-gray-600"
                            >
                                Cancel
                            </DropdownMenuItem>
                        )}
                        {currentStatus !== 'closed' && (
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('closed')}
                                className="text-blue-600"
                            >
                                Close
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 