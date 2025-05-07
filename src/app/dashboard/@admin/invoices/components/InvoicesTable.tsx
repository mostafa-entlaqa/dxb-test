"use client"

import { Invoice } from "@/actions/admin/invoices"
import { DataTable } from "@/components/data-table"
import { columns } from "../columns"
import { FilterInvoicesTable } from "./FilterInvoicesTable"

interface InvoicesTableProps {
    data: Invoice[]
}

export function InvoicesTable({ data }: InvoicesTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            renderToolbar={(table) => <FilterInvoicesTable table={table} />}
            tableName="invoices"
        />
    )
} 