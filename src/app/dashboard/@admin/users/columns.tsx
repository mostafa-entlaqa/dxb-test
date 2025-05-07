'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type User = {
    id: string
    full_name: string
    email: string
    role: string
    credits?: number
    ai_credits?: number
}

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return "bg-purple-50 text-purple-700 border-purple-200"
        case 'business':
            return "bg-blue-50 text-blue-700 border-blue-200"
        default:
            return "bg-green-50 text-green-700 border-green-200"
    }
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "full_name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge
                    variant="outline"
                    className={getRoleColor(role)}
                >
                    {role || "User"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "credits",
        header: "Credits",
        cell: ({ row }) => {
            const credits = row.getValue("credits") as number
            return credits || 0
        },
    },
    {
        accessorKey: "ai_credits",
        header: "AI Credits",
        cell: ({ row }) => {
            const credits = row.getValue("ai_credits") as number
            return credits || 0
        },
    },
    {
        id: "actions",
        size: 60,
        cell: ({ row }) => {
            const user = row.original

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
                            <a href={`/users/${user.id}`}>View Details</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`/users/${user.id}/edit`}>Edit User</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`/users/${user.id}/credits`}>Manage Credits</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 