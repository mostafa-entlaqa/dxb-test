import { Suspense } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TransactionsTable } from "./components/TransactionsTable"
import { getTransactions } from "@/actions/admin/transactions"
import { Skeleton } from "@/components/ui/skeleton"

function TransactionsTableSkeleton() {
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

async function TransactionsTableContainer() {
    const transactions = await getTransactions()
    return <TransactionsTable data={transactions} />
}

export default function TransactionsPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Transaction Management</h2>
                <p className="text-muted-foreground">
                    View and manage all transactions in one place
                </p>
            </div>

            <Suspense fallback={<TransactionsTableSkeleton />}>
                <TransactionsTableContainer />
            </Suspense>
        </DashboardLayout>
    )
} 