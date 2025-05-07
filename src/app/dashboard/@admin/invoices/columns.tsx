"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Invoice } from "@/actions/admin/invoices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, User } from "lucide-react"
import { format, isToday, isThisMonth, subDays, isSameMonth, subMonths } from "date-fns"

const formatAmount = (amount: number): string => {
    // If the amount has no decimal places or only zeros after decimal, show without decimals
    return amount % 1 === 0 ? amount.toString() : amount.toFixed(2)
}

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "user_details",
        header: "Customer",
        filterFn: (row, id, value) => {
            const user = row.original.user_details
            const searchTerm = (value as string).toLowerCase()
            const name = (user?.full_name || row.original.full_name || "").toLowerCase()
            const email = (user?.email || "").toLowerCase()
            return name.includes(searchTerm) || email.includes(searchTerm)
        },
        cell: ({ row }) => {
            const user = row.original.user_details
            const name = user?.full_name || row.original.full_name || "N/A"
            const initials = name !== "N/A" ? name.charAt(0).toUpperCase() : "?"

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile_pic_url || undefined} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{name}</span>
                        {user?.email && (
                            <span className="text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        )}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number
            const currency = row.original.currency
            return (
                <div className="font-medium">
                    {formatAmount(amount)} <span className="text-muted-foreground">{currency}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue("status") === value
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            return (
                <Badge
                    variant={
                        status === "paid"
                            ? "default"
                            : status === "pending"
                                ? "secondary"
                                : status === "failed"
                                    ? "destructive"
                                    : "outline"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "payment_date",
        header: "Payment Date",
        filterFn: (row, id, value) => {
            if (!value) return true
            const date = row.getValue("payment_date") as string
            if (!date) return false

            const paymentDate = new Date(date)
            const today = new Date()
            const lastMonth = subMonths(today, 1)

            switch (value) {
                case 'today':
                    return isToday(paymentDate)
                case 'last7days':
                    return paymentDate >= subDays(today, 7)
                case 'last30days':
                    return paymentDate >= subDays(today, 30)
                case 'thisMonth':
                    return isThisMonth(paymentDate)
                case 'lastMonth':
                    return isSameMonth(paymentDate, lastMonth)
                default:
                    return true
            }
        },
        cell: ({ row }) => {
            const date = row.getValue("payment_date") as string
            if (!date) return "-"
            return format(new Date(date), "MMM d, yyyy")
        },
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            return format(new Date(row.getValue("created_at")), "MMM d, yyyy")
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const invoice = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(invoice.id)}
                        >
                            Copy invoice ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(invoice.stripe_invoice_id || '')}
                        >
                            Copy Stripe invoice ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => window.open(`/dashboard/invoices/${invoice.id}`, '_blank')}
                        >
                            View details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 