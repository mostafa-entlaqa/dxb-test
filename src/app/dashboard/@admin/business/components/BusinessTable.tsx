'use client'

import { DataTable } from "@/components/data-table"
import { columns } from "../columns"
import { FilterBusinessTable } from "./FilterBusinessTable"
import type { Business } from "@/actions/admin/businesses"

interface BusinessTableProps {
    data: Business[]
}

export function BusinessTable({ data }: BusinessTableProps) {

    console.log('data', data)
    return (
        <DataTable
            data={data}
            columns={columns}
            renderToolbar={(table) => <FilterBusinessTable table={table} />}
            tableName="businesses"
        />
    )
} 