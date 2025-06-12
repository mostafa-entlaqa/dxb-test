"use client"

import { Bar, BarChart, XAxis } from "recharts"
import { useMemo } from "react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BusinessChartProps {
  data: any[]
}

export function BusinessChart({ data }: BusinessChartProps) {
  const chartData = useMemo(() => {
    console.log("All business data:", data) // Debug log

    // Group by month and status
    const monthlyData = new Map()

    data.forEach((business) => {
      const date = new Date(business.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      
      // Debug log for status
      console.log("Business status:", {
        id: business.id,
        approve_status: business.approve_status,
        created_at: business.created_at
      })

      const approveStatus = String(business.approve_status || "pending")
        .toLowerCase()
        .trim()

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          month: monthName,
          approved: 0,
          pending: 0,
          rejected: 0,
        })
      }

      const current = monthlyData.get(monthKey)
      if (approveStatus === "approved") {
        current.approved += 1
      } else if (approveStatus === "pending") {
        current.pending += 1
      } else if (approveStatus === "rejected") {
        current.rejected += 1
      }
    })

    const result = Array.from(monthlyData.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    console.log("Final chart data:", result) // Debug log
    return result
  }, [data])

  const chartConfig = {
    approved: {
      label: "Approved",
      color: "#10b981", // Green color
    },
    pending: {
      label: "Pending",
      color: "#f59e0b", // Amber color
    },
    rejected: {
      label: "Rejected",
      color: "#ef4444", // Red color
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
            })
          }}
        />
        <Bar
          dataKey="rejected"
          stackId="a"
          fill="#ef4444"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="pending"
          stackId="a"
          fill="#f59e0b"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="approved"
          stackId="a"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[180px]"
              formatter={(value, name, item, index) => {
                const color = name === "approved" ? "#10b981" : 
                            name === "pending" ? "#f59e0b" : 
                            "#ef4444"
                return (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: color }}
                    />
                    <span style={{ color }} className="font-medium">
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    </span>
                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                      {value}
                      <span className="text-muted-foreground font-normal">
                        businesses
                      </span>
                    </div>
                    {/* Add total after the last item */}
                    {index === 2 && (
                      <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                        Total
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {item.payload.approved + item.payload.pending + item.payload.rejected}
                          <span className="text-muted-foreground font-normal">
                            businesses
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )
              }}
            />
          }
          cursor={false}
          defaultIndex={1}
        />
      </BarChart>
    </ChartContainer>
  )
}
