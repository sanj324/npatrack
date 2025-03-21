"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NPACharts } from "@/components/charts/npa-charts"
import type { NPARecord } from "@/app/utils/dataImport"

interface ProvisionCoverageReportProps {
  data: NPARecord[]
  dateRange: { from: Date; to: Date }
}

export function ProvisionCoverageReport({ data, dateRange }: ProvisionCoverageReportProps) {
  // Group data by NPA Type
  const provisionData = data.reduce(
    (acc, record) => {
      const type = record.NPA_TYPE || "Unknown"
      if (!acc[type]) {
        acc[type] = {
          accounts: 0,
          npaAmount: 0,
          provisionAmount: 0,
        }
      }
      acc[type].accounts++
      acc[type].npaAmount += record.OVER_AMT
      acc[type].provisionAmount += record.PROV_AMT || 0
      return acc
    },
    {} as Record<string, { accounts: number; npaAmount: number; provisionAmount: number }>,
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
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800">Provision Coverage Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead className="text-green-800">NPA Type</TableHead>
                <TableHead className="text-green-800">No. of Accounts</TableHead>
                <TableHead className="text-green-800">Total NPA Amount</TableHead>
                <TableHead className="text-green-800">Provision Amount</TableHead>
                <TableHead className="text-green-800">Provision Coverage (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(provisionData || {}).map(([type, data]) => (
                <TableRow key={type}>
                  <TableCell className="font-medium">{type}</TableCell>
                  <TableCell>{data.accounts.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(data.npaAmount)}</TableCell>
                  <TableCell>{formatCurrency(data.provisionAmount)}</TableCell>
                  <TableCell>{formatPercentage((data.provisionAmount / data.npaAmount) * 100)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Provision vs NPA Amount Chart */}
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800">Provision vs NPA Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="provisioningVsPrincipal" colors={["#10B981", "#34D399"]} />
        </CardContent>
      </Card>

      {/* Provision Coverage % Over Time */}
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800">Provision Coverage % Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="provisionTrend" colors={["#10B981"]} />
        </CardContent>
      </Card>
    </div>
  )
}

