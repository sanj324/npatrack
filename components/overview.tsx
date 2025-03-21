"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { NPARecord } from "@/app/utils/dataImport"

interface OverviewProps {
  data: NPARecord[]
}

export function Overview({ data }: OverviewProps) {
  const monthlyData = data.reduce(
    (acc, record) => {
      const date = new Date(record.NPA_DATE)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear, total: 0 }
      }
      acc[monthYear].total += record.OVER_AMT
      return acc
    },
    {} as Record<string, { name: string; total: number }>,
  )

  const chartData = Object.values(monthlyData).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value / 1000000}M`}
        />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

