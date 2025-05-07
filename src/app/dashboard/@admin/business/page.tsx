import { Suspense } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BusinessTable } from "./components/BusinessTable"
import { getBusinesses } from "@/actions/admin/businesses"
import { Skeleton } from "@/components/ui/skeleton"

function BusinessTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-x-2">
                    <Skeleton className="h-10 w-[250px] inline-block" />
                    <Skeleton className="h-10 w-[150px] inline-block" />
                    <Skeleton className="h-10 w-[150px] inline-block" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <Skeleton className="h-[500px] w-full" />
        </div>
    )
}

async function BusinessTableContainer() {
    const businesses = await getBusinesses()
    return <BusinessTable data={businesses} />
}

export default function BusinessPage() {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Business Management</h2>
                <p className="text-muted-foreground">
                    Manage all business listings in one place
                </p>
            </div>

            <Suspense fallback={<BusinessTableSkeleton />}>
                <BusinessTableContainer />
            </Suspense>
        </>
    )
} 