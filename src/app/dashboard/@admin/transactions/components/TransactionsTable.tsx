"use client"

import { Transaction } from "@/actions/admin/transactions"
import { DataTable } from "@/components/data-table"
import { columns } from "../columns"

interface TransactionsTableProps {
    data: Transaction[]
}

export function TransactionsTable({ data }: TransactionsTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="id"
            filterKey="status"
            filterOptions={[
                { label: "All", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
                { label: "Failed", value: "failed" },
                { label: "Refunded", value: "refunded" },
            ]}
        />
    )
} 