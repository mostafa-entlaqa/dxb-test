'use client'

import { DataTable } from "@/components/data-table"
import { FilterMyBusinessListings } from "./components/FilterMyBusinessListings"
import { columns } from "./columns"

import React from 'react'

function BusinessListingsTable(data: any) {

    return (
        <DataTable
            data={data.data}
            columns={columns}
            renderToolbar={(table) => <FilterMyBusinessListings table={table} />}
        />
    )
}

export default BusinessListingsTable