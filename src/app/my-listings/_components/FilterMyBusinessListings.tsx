'use client'
import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ColumnDef, Table } from "@tanstack/react-table"
import { BusinessTypeCol } from "../columns"

interface FilterMyBusinessListingsProps {
    table: Table<ColumnDef<BusinessTypeCol>>
}

export function FilterMyBusinessListings({ table }: FilterMyBusinessListingsProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        // Apply filters whenever searchTerm or statusFilter changes
        table.getColumn("opportunity_name")?.setFilterValue(searchTerm)

        if (statusFilter === "all") {
            table.getColumn("form_status")?.setFilterValue("")
        } else {
            table.getColumn("form_status")?.setFilterValue(statusFilter)
        }
    }, [table, searchTerm, statusFilter])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
    }

    return (
        <div className="flex items-center justify-between py-4">
            <Input placeholder="Search businesses..." value={searchTerm} onChange={handleSearch} className="max-w-sm" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

