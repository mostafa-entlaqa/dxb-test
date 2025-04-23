import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FilterInvoicesTableProps<TData> {
    table: Table<TData>
}

export function FilterInvoicesTable<TData>({
    table,
}: FilterInvoicesTableProps<TData>) {
    return (
        <div className="flex items-center mb-4 justify-between">
            <div className="flex flex-1 items-center space-x-2">

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search businesses..."
                        value={(table.getColumn("user_details")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("user_details")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 w-[250px]"
                    />
                </div>

                {table.getColumn("status") && (
                    <Select
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className=" w-[150px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {table.getColumn("payment_date") && (
                    <Select
                        value={(table.getColumn("payment_date")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("payment_date")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Payment date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="last7days">Last 7 Days</SelectItem>
                            <SelectItem value="last30days">Last 30 Days</SelectItem>
                            <SelectItem value="thisMonth">This Month</SelectItem>
                            <SelectItem value="lastMonth">Last Month</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <Button
                    variant="ghost"
                    onClick={() => {
                        table.resetColumnFilters()
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset
                    <X className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 