"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface FinancialPerformanceProps {
  isUnlocked: boolean;
  revenue?: Record<string, number> | null;
  cost?: Record<string, number> | null;
  minProfitMargin: number;
  maxProfitMargin: number;
}

export default function FinancialPerformance({ isUnlocked, revenue = {}, cost = {}, minProfitMargin, maxProfitMargin }: FinancialPerformanceProps) {
  // Transform the data into the format needed for Recharts
  const transformedData = Object.keys({ ...revenue, ...cost })
    .sort()
    .map((year) => ({
      year: parseInt(year),
      revenue: revenue?.[year] || 0,
      cost: cost?.[year] || 0,
    }));



  return (
    <div className={isUnlocked ? "" : "filter blur-sm z-10"}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Financial Performance</h2>
      <div className="bg-blue-50  dark:bg-blue-950/50 p-4 rounded-lg mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
          <p className="text-blue-700 font-semibold">Min Profit Margin:</p>
          <p className="text-2xl text-gray-700">{minProfitMargin}%</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/50  p-4 rounded-lg">
          <p className="text-blue-700 font-semibold">Max Profit Margin:</p>
          <p className="text-2xl text-gray-700">{maxProfitMargin}%</p>
        </div>
      </div>
    </div>
  )
}

