import { Suspense } from "react"
import { SARFESIData } from "@/components/sarfesi-data"
import { SARFESIActions } from "@/components/sarfesi-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "react-error-boundary"

// Fallback data for build time or when API fails
const fallbackData = {
  // Add appropriate mock data structure here
  status: "fallback",
  message: "Using fallback data"
}

async function fetchSARFESIData() {
  try {
    // Replace this URL with your actual API endpoint
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/sarfesi-data" || "/api/sarfesi-data", {
      // Using no-store to ensure dynamic data fetching
      cache: "no-store"
    })
    
    if (!res.ok) {
      console.error("Failed to fetch SARFESI data:", res.status)
      return fallbackData
    }
    
    return res.json()
  } catch (error) {
    console.error("Error fetching SARFESI data:", error)
    return fallbackData
  }
}

// Mark the page as dynamic
export const dynamic = "force-dynamic"

export default async function SARFESIPage() {
  const sarfesiData = await fetchSARFESIData()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SARFESI Advanced Features</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <ErrorBoundary fallback={<div>Error loading SARFESI data</div>}>
          <Suspense
            fallback={
              <Card>
                <CardContent>Loading SARFESI data...</CardContent>
              </Card>
            }
          >
            <SARFESIData data={sarfesiData} />
          </Suspense>
        </ErrorBoundary>
        <Card>
          <CardHeader>
            <CardTitle>SARFESI Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <SARFESIActions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

