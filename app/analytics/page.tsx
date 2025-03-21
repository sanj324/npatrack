"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { NPACharts } from "@/components/charts/npa-charts"
import { DollarSign, Users, BarChart2, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })

  const kpiData = {
    totalNPA: 1850000000,
    npaRatio: 4.2,
    recoveryRate: 22.5,
    provisionCoverage: 68.5,
  }

  const summaryData = [
    {
      title: "Total Advances",
      value: "₹45,678.90 Cr",
      change: 5.2,
      trend: "up",
    },
    {
      title: "Gross NPA",
      value: "₹1,850.00 Cr",
      change: -2.1,
      trend: "down",
    },
    {
      title: "Net NPA",
      value: "₹925.00 Cr",
      change: -3.5,
      trend: "down",
    },
    {
      title: "NPA Accounts",
      value: "1,234",
      change: -1.8,
      trend: "down",
    },
    {
      title: "Recovery This Month",
      value: "₹45.67 Cr",
      change: 7.3,
      trend: "up",
    },
    {
      title: "Legal Cases",
      value: "89",
      change: 2.5,
      trend: "up",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">NPA Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="main">Main Branch</SelectItem>
              <SelectItem value="city">City Branch</SelectItem>
              <SelectItem value="industrial">Industrial Branch</SelectItem>
              <SelectItem value="rural">Rural Branch</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NPA</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(kpiData.totalNPA / 10000000).toFixed(2)} Cr</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross NPA Ratio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.npaRatio}%</div>
            <p className="text-xs text-muted-foreground">-0.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.recoveryRate}%</div>
            <p className="text-xs text-muted-foreground">+1.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provision Coverage</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.provisionCoverage}%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className={`text-xs ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {item.trend === "up" ? "+" : "-"}
                {Math.abs(item.change)}% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <NPACharts />
    </div>
  )
}

