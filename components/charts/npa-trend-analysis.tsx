"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { NPARecord } from "@/app/utils/dataImport"

// Safe calculation functions with validation
const safeCalculateNPAPercentage = (
  overAmount: number | null | undefined,
  openingBalance: number | null | undefined,
): number => {
  if (
    typeof overAmount !== "number" ||
    typeof openingBalance !== "number" ||
    openingBalance === 0 ||
    isNaN(overAmount) ||
    isNaN(openingBalance)
  ) {
    return 0
  }
  const percentage = (overAmount / openingBalance) * 100
  // Ensure percentage is within reasonable bounds (0-100%)
  return Math.max(0, Math.min(100, percentage))
}

const safeFormatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  } catch {
    return ""
  }
}

interface NPATrendAnalysisProps {
  data: NPARecord[]
}

export function NPATrendAnalysis({ data }: NPATrendAnalysisProps) {
  // Validate input data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No data available for trend analysis</p>
      </div>
    )
  }

  // Process and validate data
  const processedData = data
    .filter((item): item is NPARecord => {
      return (
        item !== null &&
        typeof item === "object" &&
        typeof item.OVER_AMT === "number" &&
        typeof item.OP_BAL === "number" &&
        typeof item.NPA_DATE === "string"
      )
    })
    .map((item) => {
      const date = safeFormatDate(item.NPA_DATE)
      if (!date) return null

      return {
        date,
        npaPercentage: safeCalculateNPAPercentage(item.OVER_AMT, item.OP_BAL),
        amount: item.OVER_AMT,
        balance: item.OP_BAL,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group by date and calculate average
  const aggregatedData = processedData.reduce(
    (acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = {
          date: curr.date,
          npaPercentage: 0,
          totalAmount: 0,
          totalBalance: 0,
          count: 0,
        }
      }
      acc[curr.date].totalAmount += curr.amount
      acc[curr.date].totalBalance += curr.balance
      acc[curr.date].count += 1
      return acc
    },
    {} as Record<
      string,
      { date: string; npaPercentage: number; totalAmount: number; totalBalance: number; count: number }
    >,
  )

  // Calculate final percentages
  const chartData = Object.values(aggregatedData).map((item) => ({
    date: item.date,
    npaPercentage: safeCalculateNPAPercentage(item.totalAmount, item.totalBalance),
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No valid data available for trend analysis</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NPA Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            npaPercentage: {
              label: "NPA %",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${value.toFixed(2)}%`} domain={[0, "auto"]} tick={{ fontSize: 12 }} />
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${value.toFixed(2)}%`, "NPA Percentage"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="npaPercentage"
                stroke="var(--color-npaPercentage)"
                name="NPA %"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

