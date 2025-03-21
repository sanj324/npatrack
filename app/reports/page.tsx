"use client"

import { useState, useEffect } from "react"
import { Download, FileText, PieChart, TrendingUp, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NPARecord } from "../utils/dataImport"
import { NPASummaryReport } from "@/components/reports/npa-summary-report"
import { DetailedNPAReport } from "@/components/reports/detailed-npa-report"
import { ProvisionCoverageReport } from "@/components/reports/provision-coverage-report"
import { RecoveryPerformanceReport } from "@/components/reports/recovery-performance-report"
import ErrorBoundary from "@/components/error-boundary"

const reportColors = {
  summary: "bg-blue-500 hover:bg-blue-600 text-white",
  detailed: "bg-purple-500 hover:bg-purple-600 text-white",
  provision: "bg-green-500 hover:bg-green-600 text-white",
  recovery: "bg-amber-500 hover:bg-amber-600 text-white",
}

export default function ReportsPage() {
  const [npaData, setNpaData] = useState<NPARecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
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
        setNpaData(data)
      } catch (error) {
        console.error("Error fetching NPA data:", error)
        setError("Failed to load NPA data. Please try importing data first.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleExportReport = (reportType: string) => {
    // Implementation for exporting reports
    console.log(`Exporting ${reportType} report...`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <a href="/import">Import NPA Data</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">NPA Reports</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 gap-4">
          <TabsTrigger value="summary" className={`${reportColors.summary} transition-colors duration-200`}>
            <FileText className="w-4 h-4 mr-2" />
            NPA Summary Report
          </TabsTrigger>
          <TabsTrigger value="detailed" className={`${reportColors.detailed} transition-colors duration-200`}>
            <BarChart className="w-4 h-4 mr-2" />
            Detailed NPA Report
          </TabsTrigger>
          <TabsTrigger value="provision" className={`${reportColors.provision} transition-colors duration-200`}>
            <PieChart className="w-4 h-4 mr-2" />
            Provision Coverage Report
          </TabsTrigger>
          <TabsTrigger value="recovery" className={`${reportColors.recovery} transition-colors duration-200`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Recovery Performance Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <ErrorBoundary>
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                <div>
                  <CardTitle className="text-blue-800">NPA Summary Report</CardTitle>
                  <CardDescription className="text-blue-600">Overview of NPA status and key metrics</CardDescription>
                </div>
                <Button onClick={() => handleExportReport("summary")} className="bg-blue-500 hover:bg-blue-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <NPASummaryReport data={npaData} dateRange={dateRange} />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="detailed">
          <ErrorBoundary>
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-purple-50">
                <div>
                  <CardTitle className="text-purple-800">Detailed NPA Report</CardTitle>
                  <CardDescription className="text-purple-600">Comprehensive account-wise NPA details</CardDescription>
                </div>
                <Button onClick={() => handleExportReport("detailed")} className="bg-purple-500 hover:bg-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <DetailedNPAReport data={npaData} dateRange={dateRange} />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="provision">
          <ErrorBoundary>
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-green-50">
                <div>
                  <CardTitle className="text-green-800">Provision Coverage Report</CardTitle>
                  <CardDescription className="text-green-600">
                    Analysis of provision coverage ratio and requirements
                  </CardDescription>
                </div>
                <Button onClick={() => handleExportReport("provision")} className="bg-green-500 hover:bg-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <ProvisionCoverageReport data={npaData} dateRange={dateRange} />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="recovery">
          <ErrorBoundary>
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-amber-50">
                <div>
                  <CardTitle className="text-amber-800">Recovery Performance Report</CardTitle>
                  <CardDescription className="text-amber-600">
                    Analysis of recovery efforts and outcomes
                  </CardDescription>
                </div>
                <Button onClick={() => handleExportReport("recovery")} className="bg-amber-500 hover:bg-amber-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <RecoveryPerformanceReport data={npaData} dateRange={dateRange} />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  )
}

