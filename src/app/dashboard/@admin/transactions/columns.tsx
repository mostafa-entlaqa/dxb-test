"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/actions/admin/transactions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("amount"))
        },
    },
    {
        accessorKey: "user",
        header: "Customer",
        cell: ({ row }) => {
            const user = row.getValue("user") as Transaction["user"]
            return user.name || user.email
        },
    },
    {
        accessorKey: "business",
        header: "Business",
        cell: ({ row }) => {
            const business = row.getValue("business") as Transaction["business"]
            return business.name
        },
    },
    {
        accessorKey: "payment_method",
        header: "Payment Method",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            return (
                <Badge
                    variant={
                        status === "completed"
                            ? "success"
                            : status === "pending"
                                ? "warning"
                                : status === "failed"
                                    ? "destructive"
                                    : "secondary"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            return format(new Date(row.getValue("created_at")), "MMM d, yyyy")
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const transaction = row.original

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
                            onClick={() => navigator.clipboard.writeText(transaction.id)}
                        >
                            Copy transaction ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => window.open(`/dashboard/transactions/${transaction.id}`, '_blank')}
                        >
                            View details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 