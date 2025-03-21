"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { NPACharts } from "@/components/charts/npa-charts"
import type { NPARecord } from "@/app/utils/dataImport"

interface DetailedNPAReportProps {
  data: NPARecord[]
  dateRange: { from: Date; to: Date }
}

export function DetailedNPAReport({ data, dateRange }: DetailedNPAReportProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter data based on search term
  const filteredData = data.filter((record) => {
    if (!record || !record.ACC_CODE || !record.NAME) return false
    return (
      record.ACC_CODE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.NAME.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by Account No. or Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm border-purple-300 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800">Account Level Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-purple-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-100">
                  <TableHead className="text-purple-800">Account No.</TableHead>
                  <TableHead className="text-purple-800">Customer Name</TableHead>
                  <TableHead className="text-purple-800">Loan Type</TableHead>
                  <TableHead className="text-purple-800">Branch</TableHead>
                  <TableHead className="text-purple-800">NPA Type</TableHead>
                  <TableHead className="text-purple-800">Overdue Amount</TableHead>
                  <TableHead className="text-purple-800">No. of Overdue Months</TableHead>
                  <TableHead className="text-purple-800">Interest Due</TableHead>
                  <TableHead className="text-purple-800">Security Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <TableRow key={record.ACC_CODE}>
                      <TableCell>{record.ACC_CODE}</TableCell>
                      <TableCell>{record.NAME}</TableCell>
                      <TableCell>{record.ACTYP}</TableCell>
                      <TableCell>{record.BRANCH_CODE}</TableCell>
                      <TableCell>{record.NPA_TYPE}</TableCell>
                      <TableCell>{formatCurrency(record.OVER_AMT)}</TableCell>
                      <TableCell>{record.NO_ODMTH}</TableCell>
                      <TableCell>{formatCurrency(record.INT_PROV || 0)}</TableCell>
                      <TableCell>{record.SEC_UNSEC_TYP}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Loan Type-wise NPA */}
      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800">Loan Type-wise NPA Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts
            data={data}
            chartType="loanTypeNPA"
            colors={["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"]}
          />
        </CardContent>
      </Card>

      {/* Aging Analysis */}
      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800">Aging Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="agingAnalysis" colors={["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"]} />
        </CardContent>
      </Card>

      {/* NPA Trend by Account Type */}
      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800">NPA Trend by Account Type</CardTitle>
        </CardHeader>
        <CardContent>
          <NPACharts data={data} chartType="npaPercentageByLoanType" colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]} />
        </CardContent>
      </Card>
    </div>
  )
}

