"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NPACharts } from "@/components/charts/npa-charts"
import type { NPARecord } from "@/app/utils/dataImport"

interface NPASummaryReportProps {
  data: NPARecord[]
  dateRange: { from: Date; to: Date }
}

export function NPASummaryReport({ data, dateRange }: NPASummaryReportProps) {
  // Calculate key metrics
  const totalNPAs = data.reduce((sum, record) => sum + record.OVER_AMT, 0)
  const totalAdvances = data.reduce((sum, record) => sum + record.LIMIT, 0)
  const totalProvisions = data.reduce((sum, record) => sum + (record.PROV_AMT || 0), 0)
  // Exclude ST (Standard) accounts from the total count
  const numberOfAccounts = data.filter((record) => record.NPA_TYPE !== "ST").length

  // Calculate ratios
  const grossNPARatio = (totalNPAs / totalAdvances) * 100
  const netNPARatio = ((totalNPAs - totalProvisions) / totalAdvances) * 100
  const provisionCoverageRatio = (totalProvisions / totalNPAs) * 100

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
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Executive Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="w-[200px] text-blue-800">Metric</TableHead>
                <TableHead className="text-blue-800">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total NPAs</TableCell>
                <TableCell>{formatCurrency(totalNPAs)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gross NPA Ratio</TableCell>
                <TableCell>{formatPercentage(grossNPARatio)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net NPA Ratio</TableCell>
                <TableCell>{formatPercentage(netNPARatio)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Provision Coverage Ratio (PCR)</TableCell>
                <TableCell>{formatPercentage(provisionCoverageRatio)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Advances</TableCell>
                <TableCell>{formatCurrency(totalAdvances)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Number of NPA Accounts (Excluding ST)</TableCell>
                <TableCell>{numberOfAccounts.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* NPA Trend Chart */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">NPA Trend (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[400px]">
            <div className="w-full h-full">
              <NPACharts data={data} chartType="npaTrend" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">NPA Classification Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[400px]">
            <div className="w-full h-full">
              <NPACharts data={data} chartType="npaTypeDistribution" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch-wise NPA Distribution */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Branch-wise NPA Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[400px]">
            <div className="w-full h-full">
              <NPACharts data={data} chartType="branchNPA" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Secured vs Unsecured Loans</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[400px]">
            <div className="w-full h-full">
              <NPACharts data={data} chartType="securedVsUnsecured" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add more chart sections as needed */}
    </div>
  )
}

