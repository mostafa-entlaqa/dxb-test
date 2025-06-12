"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionChart } from "./transaction-chart"
import { BusinessChart } from "./business-chart"
import { RevenueChart } from "./revenue-chart"
import { UserGrowthChart } from "./user-growth-chart"
import { DateFilters } from "./date-filters"

interface FilterState {
  timeRange: string
  dateRange: { from: Date | null; to: Date | null }
}

interface DashboardClientProps {
  users: any[]
  businesses: any[]
  invoices: any[]
  subscriptions: any[]
  businessOwnerIds: Set<any>
  paidInvoices: any[]
  pendingInvoices: any[]
  failedInvoices: any[]
}

export function DashboardClient({
  users,
  businesses,
  invoices,
  subscriptions,
  businessOwnerIds,
  paidInvoices,
  pendingInvoices,
  failedInvoices,
}: DashboardClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    timeRange: "3months",
    dateRange: { from: null, to: null },
  })

  // Filter data based on current filters
  const getFilteredData = () => {
    // If "all" is selected, return all data
    if (filters.timeRange === "all") {
      return {
        filteredInvoices: invoices,
        filteredUsers: users,
        filteredBusinesses: businesses,
      }
    }

    const now = new Date()
    let startDate: Date

    // Use custom date range if set
    if (filters.timeRange === "custom" && filters.dateRange.from && filters.dateRange.to) {
      startDate = filters.dateRange.from
      const endDate = filters.dateRange.to

      return {
        filteredInvoices: invoices.filter((item: any) => {
          const itemDate = new Date(item.created_at)
          return itemDate >= startDate && itemDate <= endDate
        }),
        filteredUsers: users.filter((item: any) => {
          const itemDate = new Date(item.created_at)
          return itemDate >= startDate && itemDate <= endDate
        }),
        filteredBusinesses: businesses.filter((item: any) => {
          const itemDate = new Date(item.created_at)
          return itemDate >= startDate && itemDate <= endDate
        }),
      }
    }

    // Apply time range filter
    switch (filters.timeRange) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "6months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case "1year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        break
      default: // 3months
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    }

    return {
      filteredInvoices: invoices.filter((item: any) => {
        const itemDate = new Date(item.created_at)
        return itemDate >= startDate
      }),
      filteredUsers: users.filter((item: any) => {
        const itemDate = new Date(item.created_at)
        return itemDate >= startDate
      }),
      filteredBusinesses: businesses.filter((item: any) => {
        const itemDate = new Date(item.created_at)
        return itemDate >= startDate
      }),
    }
  }

  const { filteredInvoices, filteredUsers, filteredBusinesses } = getFilteredData()

  const getFilterDescription = () => {
    if (filters.timeRange === "all") return "All time data"
    if (filters.timeRange === "custom" && filters.dateRange.from && filters.dateRange.to) {
      return `Custom range: ${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`
    }
    switch (filters.timeRange) {
      case "7days":
        return "Last 7 days"
      case "30days":
        return "Last 30 days"
      case "6months":
        return "Last 6 months"
      case "1year":
        return "Last year"
      default:
        return "Last 3 months"
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Analytics & Trends</h3>
          <p className="text-sm text-muted-foreground">Showing data for: {getFilterDescription()}</p>
        </div>
        <DateFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue from paid transactions over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={filteredInvoices} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart data={filteredUsers} sellerIds={businessOwnerIds} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Transaction status breakdown for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionChart data={filteredInvoices} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Listings</CardTitle>
            <CardDescription>Business application trends over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessChart data={filteredBusinesses} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
