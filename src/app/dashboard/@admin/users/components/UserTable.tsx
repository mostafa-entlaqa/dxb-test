'use client'

import { DataTable } from "@/components/data-table"
import { columns } from "../columns"
import { User } from "../columns"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface UserTableProps {
    data: User[]
}

export function UserTable({ data }: UserTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredData = data.filter((user) => {
        const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                tableName="users"
            />
        </div>
    )
} 