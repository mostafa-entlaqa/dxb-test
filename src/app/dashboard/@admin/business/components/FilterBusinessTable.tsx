'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import { Business } from "../columns"
import { Badge } from "@/components/ui/badge"

interface FilterBusinessTableProps {
    table: Table<Business>
}

export function FilterBusinessTable({ table }: FilterBusinessTableProps) {
    return (
        <div className="flex w-full md:items-center flex-col md:flex-row md:justify-between  mb-6">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search businesses..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 w-[250px]"
                    />
                </div>
                <Select
                    value={(table.getColumn("form_status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                        table.getColumn("form_status")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            All Status
                        </SelectItem>
                        <SelectItem value="pending">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Pending
                            </Badge>
                        </SelectItem>
                        <SelectItem value="approved">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Approved
                            </Badge>
                        </SelectItem>
                        <SelectItem value="rejected">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Rejected
                            </Badge>
                        </SelectItem>
                        <SelectItem value="cancelled">
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                Cancelled
                            </Badge>
                        </SelectItem>
                        <SelectItem value="closed">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Closed
                            </Badge>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={(table.getColumn("acquisition_type")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                        table.getColumn("acquisition_type")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Invest">Investment</SelectItem>
                        <SelectItem value="Buy">Buy</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button>Export</Button>
        </div>
    )
} 