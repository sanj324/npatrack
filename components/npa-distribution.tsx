"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { NPARecord } from "@/app/utils/dataImport"

interface NPADistributionProps {
  data: NPARecord[]
}

export function NPADistribution({ data }: NPADistributionProps) {
  const distributionData = data.reduce(
    (acc, record) => {
      if (!acc[record.NPA_TYPE]) {
        acc[record.NPA_TYPE] = { name: record.NPA_TYPE, value: 0 }
      }
      acc[record.NPA_TYPE].value += record.OVER_AMT
      return acc
    },
    {} as Record<string, { name: string; value: number }>,
  )

  const chartData = Object.values(distributionData)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

