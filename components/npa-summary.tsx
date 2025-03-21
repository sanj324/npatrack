"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, TrendingDown, TrendingUp } from "lucide-react"
import type { NPARecord } from "@/app/utils/dataImport"

interface NPASummaryProps {
  data: NPARecord[]
}

interface SummaryData {
  npaType: string
  accountCount: number
  totalNPA: number
  npaPercentage: number
  totalAdvances: number
}

// NPA Type descriptions and colors
const npaTypeInfo: Record<string, { description: string; color: string; bgColor: string }> = {
  SU: {
    description: "Sub-standard",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  D2: {
    description: "Doubtful 2",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  D3: {
    description: "Doubtful 3",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  LO: {
    description: "Loss",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  ST: {
    description: "Standard",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
}

export function NPASummary({ data }: NPASummaryProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No data available for NPA summary</p>
      </div>
    )
  }

  // Process data to calculate summary with corrected NPA percentage calculation
  const summaryByType = data.reduce(
    (acc, record) => {
      if (!record || !record.NPA_TYPE || typeof record.OVER_AMT !== "number" || typeof record.LIMIT !== "number") {
        return acc
      }

      if (!acc[record.NPA_TYPE]) {
        acc[record.NPA_TYPE] = {
          npaType: record.NPA_TYPE,
          accountCount: 0,
          totalNPA: 0,
          totalAdvances: 0,
        }
      }

      acc[record.NPA_TYPE].accountCount += 1
      acc[record.NPA_TYPE].totalNPA += Math.abs(record.OVER_AMT)
      acc[record.NPA_TYPE].totalAdvances += Math.abs(record.LIMIT)

      return acc
    },
    {} as Record<string, { npaType: string; accountCount: number; totalNPA: number; totalAdvances: number }>,
  )

  // Convert to array and calculate correct percentages
  const summaryData: SummaryData[] = Object.values(summaryByType)
    .map((item) => ({
      npaType: item.npaType,
      accountCount: item.accountCount,
      totalNPA: item.totalNPA,
      totalAdvances: item.totalAdvances,
      npaPercentage: (item.totalNPA / item.totalAdvances) * 100,
    }))
    .sort((a, b) => b.totalNPA - a.totalNPA)

  // Calculate table totals (371 total)
  const tableTotals = summaryData.reduce(
    (acc, item) => ({
      accountCount: acc.accountCount + item.accountCount,
      totalNPA: acc.totalNPA + item.totalNPA,
      totalAdvances: acc.totalAdvances + item.totalAdvances,
    }),
    { accountCount: 0, totalNPA: 0, totalAdvances: 0 },
  )

  // Calculate total NPA accounts for summary cards (1,987)
  //const totalNPAAccounts = 1987 // Hardcoded as per requirement

  // Calculate totals with corrected percentage - Include ALL accounts in count
  const totals = summaryData.reduce(
    (acc, item) => ({
      accountCount: acc.accountCount + item.accountCount, // Remove ST exclusion to include all accounts
      totalNPA: acc.totalNPA + item.totalNPA,
      totalAdvances: acc.totalAdvances + item.totalAdvances,
    }),
    { accountCount: 0, totalNPA: 0, totalAdvances: 0 },
  )

  // Calculate overall NPA percentage correctly
  const overallNPAPercentage = (totals.totalNPA / totals.totalAdvances) * 100

  // Helper function to determine if a percentage is concerning
  const isHighNPAPercentage = (percentage: number) => percentage > 5 // Threshold can be adjusted

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`
  }

  return (
    <TooltipProvider>
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardTitle className="text-2xl font-bold tracking-tight">NPA Summary Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 dark:bg-blue-900/50">
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100">NPA Type</TableHead>
                  <TableHead className="text-right font-semibold text-blue-900 dark:text-blue-100">
                    No. of Accounts
                  </TableHead>
                  <TableHead className="text-right font-semibold text-blue-900 dark:text-blue-100">
                    Total NPA Amount
                  </TableHead>
                  <TableHead className="text-right font-semibold text-blue-900 dark:text-blue-100">NPA %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.map((item) => {
                  const typeInfo = npaTypeInfo[item.npaType] || {
                    description: "Unknown",
                    color: "text-gray-700 dark:text-gray-400",
                    bgColor: "bg-gray-50 dark:bg-gray-900/20",
                  }

                  return (
                    <TableRow
                      key={item.npaType}
                      className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={`${typeInfo.color} ${typeInfo.bgColor} transition-colors`}
                          >
                            {item.npaType}
                          </Badge>
                          <span className="text-muted-foreground text-sm">{typeInfo.description}</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4 text-muted-foreground/70" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click for detailed analysis of {typeInfo.description} accounts</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{item.accountCount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.totalNPA)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isHighNPAPercentage(item.npaPercentage) ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span
                            className={
                              isHighNPAPercentage(item.npaPercentage) ? "text-red-600 font-semibold" : "text-green-600"
                            }
                          >
                            {formatPercentage(item.npaPercentage)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-blue-100 dark:bg-blue-900/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">{tableTotals.accountCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(tableTotals.totalNPA)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {isHighNPAPercentage(overallNPAPercentage) ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <span
                        className={
                          isHighNPAPercentage(overallNPAPercentage) ? "text-red-600 font-semibold" : "text-green-600"
                        }
                      >
                        {formatPercentage(overallNPAPercentage)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950 transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total NPA Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.filter((record) => record.NPA_TYPE !== "ST").length.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950 transition-all duration-200 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(totals.totalNPA)}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total NPA Amount</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950 transition-all duration-200 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {formatPercentage(overallNPAPercentage)}
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">Overall NPA Percentage</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950 transition-all duration-200 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(totals.totalNPA / totals.accountCount)}
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">Average NPA per Account</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200">Key Insights:</h4>
            <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
              <li>
                Overall NPA percentage is {formatPercentage(overallNPAPercentage)}
                {isHighNPAPercentage(overallNPAPercentage) && " (Requires immediate attention)"}
              </li>
              <li>
                The highest concentration of NPAs is in the {summaryData[0]?.npaType} category with{" "}
                {formatPercentage(summaryData[0]?.npaPercentage)} of total NPAs
              </li>
              <li>Average NPA amount per account: {formatCurrency(totals.totalNPA / totals.accountCount)}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

