'use client'

import { DataTable } from "@/components/data-table"
import { FilterMyBusinessListings } from "./_components/FilterMyBusinessListings"
import { columns } from "./columns"

import React from 'react'

function BusinessListingsTable(data: any) {

    console.log(
        data, 'data'
    )
    return (
        <DataTable
            data={data.data}
            columns={columns}
            renderToolbar={(table) => <FilterMyBusinessListings table={table} />}
        />
    )
}

export default BusinessListingsTable