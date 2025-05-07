'use client'

import type React from "react"

import { useState } from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportButton } from "@/components/export-button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    renderToolbar?: (table: any) => React.ReactNode
    tableName?: string
}

export function DataTable<TData, TValue>({ columns, data, renderToolbar, tableName }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pageSize, setPageSize] = useState(5)
    const [pageIndex, setPageIndex] = useState(0)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: updater => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize })
                setPageIndex(newState.pageIndex ?? 0)
                setPageSize(newState.pageSize ?? 5)
            } else if (typeof updater === "object") {
                if (typeof updater.pageIndex === "number") setPageIndex(updater.pageIndex)
                if (typeof updater.pageSize === "number") setPageSize(updater.pageSize)
            }
        },
    })

    // When pageSize changes, reset to first page
    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setPageIndex(0)
    }

    // Get visible columns for export
    const visibleColumns = table.getVisibleFlatColumns().map(col => {
        let getExportValue: ((row: any) => any) | undefined = undefined
        // Custom export logic for Customer column
        if (col.id === 'user_details') {
            getExportValue = (row: any) => {
                const user = row.user_details
                return user?.full_name || row.full_name || ''
            }
        }
        return {
            id: col.id,
            header: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
            accessorKey: (col.columnDef as any).accessorKey,
            getExportValue
        }
    })
    const rowModel = table.getRowModel().rows

    return (
        <div>
           <div className="flex my-2 items-center justify-between">
           {renderToolbar ? renderToolbar(table) : <div></div>}
           <ExportButton 
                    columns={visibleColumns}
                    data={data}
                    filename={tableName ? `${tableName}.xlsx` : "data.xlsx"}
                />
            </div>

            <div className="rounded-md border ">
                <Table>
                    <TableHeader className="bg-primary text-white dark:bg-blue-600 hover:bg-primary">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-white">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <Select value={String(pageSize)} onValueChange={val => handlePageSizeChange(Number(val))}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map(size => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

