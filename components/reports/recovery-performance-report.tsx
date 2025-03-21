"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NPACharts } from "@/components/charts/npa-charts"
import type { NPARecord } from "@/app/utils/dataImport"

interface RecoveryPerformanceReportProps {
  data: NPARecord[]
  dateRange: { from: Date; to: Date }
}

export function RecoveryPerformanceReport({ data, dateRange }: RecoveryPerformanceReportProps) {
  // Group data by month
  const recoveryData = data.reduce(
    (acc, record) => {
      const date = new Date(record.NPA_DATE)
      const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" })

      if (!acc[monthYear]) {
        acc[monthYear] = {
          totalRecoveries: 0,
          accountsRecovered: 0,
          legalCasesClosed: 0,
        }
      }

      acc[monthYear].totalRecoveries += record.TOT_CREDIT || 0
      if (record.TOT_CREDIT > 0) {
        acc[monthYear].accountsRecovered++
      }
      // Assuming legal cases closed is tracked in some field
      if (record.LEGAL_STATUS === "CLOSED") {
        acc[monthYear].legalCasesClosed++
      }

      return acc
    },
    {} as Record<
      string,
      {
        totalRecoveries: number
        accountsRecovered: number
        legalCasesClosed: number
      }
    >,
  )

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-800">Monthly Recovery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-100">
                <TableHead className="text-amber-800">Month</TableHead>
                <TableHead className="text-amber-800">Total Recoveries</TableHead>
                <TableHead className="text-amber-800">No. of Accounts Recovered</TableHead>
                <TableHead className="text-amber-800">Recovery Rate (%)</TableHead>
                <TableHead className="text-amber-800">Legal Cases Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(recoveryData || {}).map(([monthYear, data]) => {
                const totalNPA = data.totalRecoveries // This should ideally be the total NPA amount for the month
                const recoveryRate = (data.totalRecoveries / totalNPA) * 100

                return (
                  <TableRow key={monthYear}>
                    <TableCell className="font-medium">{monthYear}</TableCell>
                    <TableCell>{formatCurrency(data.totalRecoveries)}</TableCell>
                    <TableCell>{data.accountsRecovered}</TableCell>
                    <TableCell>{formatPercentage(recoveryRate)}</TableCell>
                    <TableCell>{data.legalCasesClosed}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recovery Trend Chart */}
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-800">Recovery Trend (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="recoveryTrend" colors={["#F59E0B"]} />
        </CardContent>
      </Card>

      {/* Recovery vs New NPA Addition */}
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-800">Recovery vs New NPA Addition</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="recoveryVsFreshNPA" colors={["#F59E0B", "#FBBF24"]} />
        </CardContent>
      </Card>

      {/* Legal Case Settlement Rate */}
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-800">Legal Case Settlement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="legalCaseSettlement" colors={["#F59E0B", "#FCD34D"]} />
        </CardContent>
      </Card>
    </div>
  )
}

