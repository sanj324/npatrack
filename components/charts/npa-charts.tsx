"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { NPARecord } from "@/app/utils/dataImport"

interface NPAChartsProps {
  data: NPARecord[]
  chartType: string
}

export function NPACharts({ data, chartType }: NPAChartsProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No data available for visualization</p>
      </div>
    )
  }

  const processDataForChart = () => {
    switch (chartType) {
      case "loanTypeNPA":
        return data.reduce((acc: any[], record) => {
          const existingType = acc.find((item) => item.type === record.ACTYP)
          if (existingType) {
            existingType.amount += record.OVER_AMT || 0
          } else {
            acc.push({ type: record.ACTYP || "Unknown", amount: record.OVER_AMT || 0 })
          }
          return acc
        }, [])

      case "npaTrend":
        return data.reduce((acc: any[], record) => {
          const date = new Date(record.NPA_DATE)
          const month = date.toLocaleString("default", { month: "short", year: "numeric" })
          const existingMonth = acc.find((item) => item.month === month)
          if (existingMonth) {
            existingMonth.amount += record.OVER_AMT || 0
          } else {
            acc.push({ month, amount: record.OVER_AMT || 0 })
          }
          return acc.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        }, [])

      case "securedVsUnsecured":
        return data.reduce((acc: any[], record) => {
          const type = record.SEC_UNSEC_TYP || "Unknown"
          const existingType = acc.find((item) => item.name === type)
          if (existingType) {
            existingType.value += record.OVER_AMT || 0
          } else {
            acc.push({ name: type, value: record.OVER_AMT || 0 })
          }
          return acc
        }, [])

      default:
        return []
    }
  }

  const chartData = processDataForChart()

  const renderChart = () => {
    switch (chartType) {
      case "loanTypeNPA":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "npaTrend":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )

      case "securedVsUnsecured":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" nameKey="name" data={chartData} fill="#8884d8" label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">{renderChart()}</CardContent>
    </Card>
  )
}

