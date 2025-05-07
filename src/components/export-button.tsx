import * as XLSX from 'xlsx'
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps<TData> {
    columns: {
        id: string
        header: string
        accessorKey?: string
        getExportValue?: (row: TData) => any
    }[]
    data: TData[]
    filename?: string
}

export function ExportButton<TData>({ columns, data, filename = "export.xlsx" }: ExportButtonProps<TData>) {
    const handleExport = () => {
        // Prepare the data for export, matching the visible table
        const exportData = data.map(row => {
            const rowData: Record<string, any> = {}
            columns.forEach(col => {
                let value
                if (col.getExportValue) {
                    value = col.getExportValue(row)
                } else if (col.accessorKey) {
                    value = (row as any)[col.accessorKey]
                } else {
                    value = (row as any)[col.id]
                }
                if (typeof value === 'object' && value !== null) {
                    if (value.full_name) value = value.full_name
                    else if (value.name) value = value.name
                    else if (value.email) value = value.email
                    else value = JSON.stringify(value)
                }
                rowData[col.header] = value
            })
            return rowData
        })

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

        // Generate and download the file
        XLSX.writeFile(workbook, filename)
    }

    return (
        <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
        </Button>
    )
} 