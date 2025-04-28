import { Suspense } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InvoicesTable } from "./components/InvoicesTable"
import { getInvoices } from "@/actions/admin/invoices"
import { Skeleton } from "@/components/ui/skeleton"

function InvoicesTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-x-2">
                    <Skeleton className="h-10 w-[250px] inline-block" />
                    <Skeleton className="h-10 w-[150px] inline-block" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <Skeleton className="h-[500px] w-full" />
        </div>
    )
}

async function InvoicesTableContainer() {
    const invoices = await getInvoices()
    console.log(invoices)
    return <InvoicesTable data={invoices} />
}


export default function InvoicesPage() {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Invoice Management</h2>
                <p className="text-muted-foreground">
                    View and manage all invoices in one place
                </p>
            </div>

            <Suspense fallback={<InvoicesTableSkeleton />}>
                <InvoicesTableContainer />
            </Suspense>
        </>
    )
} 