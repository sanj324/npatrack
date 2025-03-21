"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import type { NPARecord } from "../utils/dataImport"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentNPAs } from "@/components/recent-npas"
import { ViewCharts } from "@/components/view-charts"
import { NPACharts } from "@/components/charts/npa-charts"
import { UserManual } from "@/components/user-manual"
import { ReportWriter } from "@/components/report-writer"

const tabStyles = {
  overview: "bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
  analytics: "bg-purple-50 text-purple-900 dark:bg-purple-900 dark:text-purple-50",
  viewcharts: "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50",
  usermanual: "bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50",
  reportwriter: "bg-indigo-50 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-50",
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to format percentage
const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`
}

export default function DashboardPage() {
  const [npaData, setNpaData] = useState<NPARecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/npa-data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received")
        }
        setNpaData(data)
      } catch (error) {
        console.error("Error fetching NPA data:", error)
        setError(error instanceof Error ? error.message : "Failed to load NPA data. Please try importing data first.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredNPAData = npaData.filter((record) => {
    if (dateRange.from && dateRange.to) {
      const recordDate = new Date(record.NPA_DATE)
      return recordDate >= dateRange.from && recordDate <= dateRange.to
    }
    return true
  })

  const kpiData = {
    totalAdvances: filteredNPAData.reduce((sum, record) => sum + Math.abs(record.LIMIT), 0),
    grossNPAAmount: filteredNPAData.reduce((sum, record) => sum + Math.abs(record.OVER_AMT), 0),
    totalProvisions: filteredNPAData.reduce((sum, record) => sum + Math.abs(record.PROV_AMT || 0), 0),
  }

  // Calculate ratios using the provided formulas
  kpiData.grossNPARatio = Number(((kpiData.grossNPAAmount / kpiData.totalAdvances) * 100).toFixed(2))
  kpiData.netNPARatio = Number(
    (((kpiData.grossNPAAmount - kpiData.totalProvisions) / kpiData.totalAdvances) * 100).toFixed(2),
  )
  kpiData.provisionCoverageRatio = Number(((kpiData.totalProvisions / kpiData.grossNPAAmount) * 100).toFixed(2))

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-800 text-center">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <a href="/import">Import NPA Data</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">NPA Dashboard</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4 bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className={`data-[state=active]:${tabStyles.overview} hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors h-10`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className={`data-[state=active]:${tabStyles.analytics} hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors h-10`}
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="viewcharts"
              className={`data-[state=active]:${tabStyles.viewcharts} hover:bg-green-100 dark:hover:bg-green-800 transition-colors h-10`}
            >
              View Charts
            </TabsTrigger>
            <TabsTrigger
              value="reportwriter"
              className={`data-[state=active]:${tabStyles.reportwriter} hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors h-10`}
            >
              Report Writer
            </TabsTrigger>
            <TabsTrigger
              value="usermanual"
              className={`data-[state=active]:${tabStyles.usermanual} hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors h-10`}
            >
              User Manual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className={`space-y-4 rounded-lg p-6 ${tabStyles.overview}`}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className={kpiCardStyles.totalNPA.card}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${kpiCardStyles.totalNPA.title}`}>Total NPAs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpiCardStyles.totalNPA.value}`}>
                    {formatCurrency(kpiData.grossNPAAmount)}
                  </div>
                  <p className={`text-xs ${kpiCardStyles.totalNPA.subtext}`}>
                    {kpiData.grossNPARatio > 0 ? "+" : ""}
                    {kpiData.grossNPARatio.toFixed(2)}% of total advances
                  </p>
                </CardContent>
              </Card>
              <Card className={kpiCardStyles.grossNPA.card}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${kpiCardStyles.grossNPA.title}`}>
                    Gross NPA Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpiCardStyles.grossNPA.value}`}>
                    {kpiData.grossNPARatio.toFixed(2)}%
                  </div>
                  <p className={`text-xs ${kpiCardStyles.grossNPA.subtext}`}>Based on total advances</p>
                </CardContent>
              </Card>
              <Card className={kpiCardStyles.netNPA.card}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${kpiCardStyles.netNPA.title}`}>Net NPA Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpiCardStyles.netNPA.value}`}>
                    {kpiData.netNPARatio.toFixed(2)}%
                  </div>
                  <p className={`text-xs ${kpiCardStyles.netNPA.subtext}`}>After provisions</p>
                </CardContent>
              </Card>
              <Card className={kpiCardStyles.provisionCoverage.card}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${kpiCardStyles.provisionCoverage.title}`}>
                    Provision Coverage Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpiCardStyles.provisionCoverage.value}`}>
                    {kpiData.provisionCoverageRatio.toFixed(2)}%
                  </div>
                  <p className={`text-xs ${kpiCardStyles.provisionCoverage.subtext}`}>Of total NPAs</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>NPA Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <NPACharts data={filteredNPAData} chartType="npaTrend" />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent NPAs</CardTitle>
                  <CardDescription>New NPAs in the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentNPAs data={filteredNPAData} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Loan Type-wise NPA Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="loanTypeNPA" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secured vs Unsecured Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="securedVsUnsecured" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className={`space-y-4 rounded-lg p-6 ${tabStyles.analytics}`}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Loan Type-wise NPA Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="loanTypeNPA" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Branch-wise NPA Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="branchNPA" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Aging Analysis of NPA</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="agingAnalysis" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recovery vs Fresh NPAs</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="recoveryVsFreshNPA" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secured vs Unsecured Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPACharts data={filteredNPAData} chartType="securedVsUnsecured" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="viewcharts" className={`space-y-4 rounded-lg p-6 ${tabStyles.viewcharts}`}>
            <ViewCharts data={filteredNPAData} />
          </TabsContent>
          <TabsContent value="reportwriter" className={`space-y-4 rounded-lg p-6 ${tabStyles.reportwriter}`}>
            <ReportWriter data={filteredNPAData} />
          </TabsContent>
          <TabsContent value="usermanual" className={`space-y-4 rounded-lg p-6 ${tabStyles.usermanual}`}>
            <UserManual />
          </TabsContent>
        </Tabs>

        <div className="flex justify-center space-x-4 mt-8">
          <Button asChild>
            <a href="/import">Import New NPA Data</a>
          </Button>
          <Button variant="secondary">Export NPA Dashboard</Button>
        </div>
      </div>
    </TooltipProvider>
  )
}

const kpiCardStyles = {
  totalNPA: {
    card: "bg-blue-50 dark:bg-blue-900",
    title: "text-blue-700 dark:text-blue-300",
    value: "text-blue-900 dark:text-blue-100",
    subtext: "text-blue-600 dark:text-blue-400",
  },
  grossNPA: {
    card: "bg-green-50 dark:bg-green-900",
    title: "text-green-700 dark:text-green-300",
    value: "text-green-900 dark:text-green-100",
    subtext: "text-green-600 dark:text-green-400",
  },
  netNPA: {
    card: "bg-red-50 dark:bg-red-900",
    title: "text-red-700 dark:text-red-300",
    value: "text-red-900 dark:text-red-100",
    subtext: "text-red-600 dark:text-red-400",
  },
  provisionCoverage: {
    card: "bg-purple-50 dark:bg-purple-900",
    title: "text-purple-700 dark:text-purple-300",
    value: "text-purple-900 dark:text-purple-100",
    subtext: "text-purple-600 dark:text-purple-400",
  },
}

