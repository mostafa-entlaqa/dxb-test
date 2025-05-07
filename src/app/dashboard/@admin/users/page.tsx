import { Suspense } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserTable } from "./components/UserTable"
import { getUsers } from "@/actions/admin/users"
import { Skeleton } from "@/components/ui/skeleton"

function UserTableSkeleton() {
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

async function UserTableContainer() {
    const users = await getUsers()
    return <UserTable data={users} />
}

export default function UsersPage() {
    return (
        <>
        
            <div className="mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">
                    Manage all users in one place
                </p>
            </div>

            <Suspense fallback={<UserTableSkeleton />}>
                <UserTableContainer />
            </Suspense>
        </>
    )
}
