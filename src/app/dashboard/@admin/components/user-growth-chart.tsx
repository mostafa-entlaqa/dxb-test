"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface UserGrowthChartProps {
  data: any[]
  sellerIds: Set<string | number>
}

export function UserGrowthChart({ data, sellerIds }: UserGrowthChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)

    // Filter users from last 3 months
    const recentUsers = data.filter((user) => {
      const userDate = new Date(user.created_at)
      return userDate >= threeMonthsAgo
    })

    // Group by month and user type
    const monthlyData = new Map()

    recentUsers.forEach((user) => {
      const date = new Date(user.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const isSeller = sellerIds.has(user.id)
      const isBuyer = user.interest === "buyer" || (!isSeller && user.interest !== "seller")

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          total: 0,
          sellers: 0,
          buyers: 0,
        })
      }

      const current = monthlyData.get(monthKey)
      current.total += 1
      if (isSeller) current.sellers += 1
      if (isBuyer) current.buyers += 1
    })

    return Array.from(monthlyData.values()).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }, [data, sellerIds])

  const chartConfig = {
    total: {
      label: "Total Users",
      color: "#3b82f6", // Blue
    },
    sellers: {
      label: "Sellers",
      color: "#10b981", // Green
    },
    buyers: {
      label: "Buyers",
      color: "#f59e0b", // Amber
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-4">
      
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.split(" ")[0]}
            stroke="#64748b"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke="#64748b"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="total"
            type="natural"
            fill="#3b82f6"
            fillOpacity={0.2}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Area
            dataKey="sellers"
            type="natural"
            fill="#10b981"
            fillOpacity={0.2}
            stroke="#10b981"
            strokeWidth={2}
          />
          <Area
            dataKey="buyers"
            type="natural"
            fill="#f59e0b"
            fillOpacity={0.2}
            stroke="#f59e0b"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
