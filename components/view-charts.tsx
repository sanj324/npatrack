"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NPASummary } from "@/components/npa-summary"
import { NPACharts } from "@/components/charts/npa-charts"
import type { NPARecord } from "@/app/utils/dataImport"
import { ErrorBoundary } from "react-error-boundary"

interface ViewChartsProps {
  data: NPARecord[]
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center p-6 text-red-600">
      <p>Error loading component: {error.message}</p>
    </div>
  )
}

export function ViewCharts({ data }: ViewChartsProps) {
  const validData = Array.isArray(data) ? data : []

  return (
    <div className="space-y-6">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <NPASummary data={validData} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card>
          <CardHeader>
            <CardTitle>NPA Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <NPACharts data={validData} chartType="npaTrend" />
          </CardContent>
        </Card>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card>
          <CardHeader>
            <CardTitle>Loan Type-wise NPA Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <NPACharts data={validData} chartType="loanTypeNPA" />
          </CardContent>
        </Card>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card>
          <CardHeader>
            <CardTitle>Secured vs Unsecured Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <NPACharts data={validData} chartType="securedVsUnsecured" />
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}

