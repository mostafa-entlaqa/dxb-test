'use client'
import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"
import { BusinessTypeCol } from "../columns"

interface FilterMyBusinessListingsProps {
    table: Table<BusinessTypeCol>
}

export function FilterMyBusinessListings({ table }: FilterMyBusinessListingsProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        // Set search filter on opportunity_name
        table.getColumn("opportunity_name")?.setFilterValue(searchTerm)

        // Set status filters based on statusFilter value
        if (statusFilter === "all") {
            table.getColumn("approve_status")?.setFilterValue('')
            table.getColumn("form_status")?.setFilterValue('')

        } else if (statusFilter === "Published") {
            // table.getColumn("approve_status")?.setFilterValue("not_close")
            table.getColumn("form_status")?.setFilterValue("published")
        } else if (statusFilter === "Draft") {
            table.getColumn("approve_status")?.setFilterValue("not_close")
            table.getColumn("form_status")?.setFilterValue("Draft")
        } else if (statusFilter === "close") {
            table.getColumn("approve_status")?.setFilterValue("close")
            table.getColumn("form_status")?.setFilterValue(undefined)
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
            <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm"
            />
            <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All (Published, Draft)</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="close">Close</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}