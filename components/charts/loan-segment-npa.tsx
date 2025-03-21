"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { NPARecord } from "@/app/utils/dataImport"

interface LoanSegmentNPAProps {
  data: NPARecord[]
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatCrores = (value: number) => {
  return `₹${(value / 10000000).toFixed(2)}Cr`
}

export function LoanSegmentNPA({ data }: LoanSegmentNPAProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No data available for loan segment analysis</p>
      </div>
    )
  }

  // Process and validate data
  const processedData = data.reduce(
    (acc, record) => {
      if (
        !record ||
        !record.ACTYP ||
        typeof record.OVER_AMT !== "number" ||
        isNaN(record.OVER_AMT) ||
        record.OVER_AMT < 0
      ) {
        return acc
      }

      // Get full name for loan type
      const loanTypeNames: Record<string, string> = {
        TL: "Term Loan",
        CC: "Cash Credit",
        OD: "Overdraft",
        DL: "Demand Loan",
        HL: "Housing Loan",
        VL: "Vehicle Loan",
        PL: "Personal Loan",
        AG: "Agriculture Loan",
        BL: "Business Loan",
        ED: "Education Loan",
      }

      const loanType = loanTypeNames[record.ACTYP] || record.ACTYP

      if (!acc[loanType]) {
        acc[loanType] = {
          loanType,
          overDueAmount: 0,
          accountCount: 0,
        }
      }
      acc[loanType].overDueAmount += record.OVER_AMT
      acc[loanType].accountCount += 1
      return acc
    },
    {} as Record<string, { loanType: string; overDueAmount: number; accountCount: number }>,
  )

  // Convert to array and sort by overdue amount
  const chartData = Object.values(processedData)
    .map((item) => ({
      ...item,
      averageAmount: item.overDueAmount / item.accountCount,
    }))
    .sort((a, b) => b.overDueAmount - a.overDueAmount)

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p>No valid data available for Loan Segment-wise NPA Distribution</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Segment-wise NPA Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            overDueAmount: {
              label: "Overdue Amount",
              color: "hsl(var(--chart-1))",
            },
            accountCount: {
              label: "Account Count",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCrores} domain={[0, "auto"]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="loanType" type="category" tick={{ fontSize: 12 }} width={110} />
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  name === "overDueAmount" ? formatCurrency(value) : value,
                  name === "overDueAmount" ? "Overdue Amount" : "Account Count",
                ]}
              />
              <Legend />
              <Bar
                dataKey="overDueAmount"
                fill="var(--color-overDueAmount)"
                name="Overdue Amount"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Key Insights:</strong> This chart shows the distribution of NPAs across different loan segments. The
            bars represent the total overdue amount for each loan type. Longer bars indicate higher NPA exposure in that
            segment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

