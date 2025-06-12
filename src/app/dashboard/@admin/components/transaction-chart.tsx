"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useMemo } from "react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TransactionChartProps {
  data: any[]
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)

    // Filter invoices from last 3 months
    const recentInvoices = data.filter((invoice) => {
      const invoiceDate = new Date(invoice.created_at)
      return invoiceDate >= threeMonthsAgo
    })

    // Group by month and status
    const monthlyData = new Map()

    recentInvoices.forEach((invoice) => {
      const date = new Date(invoice.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const status = String(invoice.status).toLowerCase().trim()

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          paid: 0,
          notCompleted: 0,
        })
      }

      const current = monthlyData.get(monthKey)
      if (status === "paid") {
        current.paid += 1
      } else {
        current.notCompleted += 1
      }
    })

    return Array.from(monthlyData.values()).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }, [data])

  const chartConfig = {
    paid: {
      label: "Paid",
      color: "#10b981", // Green color
    },
    notCompleted: {
      label: "Not Completed",
      color: "#fca5a5", // Softer red color
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="paid" fill="#10b981" radius={4} />
        <Bar dataKey="notCompleted" fill="#fca5a5" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
