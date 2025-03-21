import Link from "next/link"
import { ArrowRight, FileText, BarChart2, ClipboardList, Settings, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const latestInsights = [
  {
    title: "New RBI Guidelines on NPA Resolution",
    description: "Updated framework for resolution of stressed assets effective from April 1, 2025",
    date: "2025-02-01",
    category: "Regulatory Update",
  },
  {
    title: "Digital Recovery Management System",
    description: "Implementation of AI-powered recovery tracking and monitoring system",
    date: "2025-01-28",
    category: "Technology Update",
  },
  {
    title: "Enhanced Provisioning Requirements",
    description: "Revised provisioning norms for NPAs in cooperative banks",
    date: "2025-01-25",
    category: "Policy Change",
  },
  {
    title: "Early Warning System Implementation",
    description: "New system for early identification of potential NPAs",
    date: "2025-01-20",
    category: "Risk Management",
  },
]

const complianceUpdates = [
  {
    requirement: "Asset Classification",
    description: "Daily identification and marking of NPAs as per RBI's IRAC norms",
    deadline: "Immediate",
    status: "Mandatory",
  },
  {
    requirement: "Provisioning Coverage",
    description: "Maintain minimum 70% provision coverage ratio for all NPAs",
    deadline: "March 31, 2025",
    status: "Critical",
  },
  {
    requirement: "Recovery Documentation",
    description: "Digital documentation of all recovery efforts and communications",
    deadline: "June 30, 2025",
    status: "Important",
  },
  {
    requirement: "Stress Testing",
    description: "Quarterly stress testing of NPA portfolio",
    deadline: "Quarterly",
    status: "Regular",
  },
]

const advancedFeatures = [
  {
    title: "Early Warning System",
    description: "AI-powered system to identify potential NPAs before they occur",
    icon: AlertTriangle,
    link: "/advanced-features#early-warning",
  },
  {
    title: "Automated Provisioning",
    description: "Real-time provisioning calculations based on latest RBI guidelines",
    icon: BarChart2,
    link: "/advanced-features#provisioning",
  },
  {
    title: "Legal Action Tracker",
    description: "Streamlined management of legal proceedings for NPA accounts",
    icon: ClipboardList,
    link: "/advanced-features#legal-tracker",
  },
  {
    title: "Recovery Optimization",
    description: "ML models to optimize recovery strategies for different NPA types",
    icon: Settings,
    link: "/advanced-features#recovery",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-red-200">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-blue-800">Co-operative Bank NPA Management System</h1>
        <p className="text-xl mb-12 text-blue-600 max-w-2xl">
          Streamline your NPA management process and ensure compliance with the latest RBI guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2" />
                  Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Comprehensive overview of your NPA portfolio with key metrics and trends.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/data-entry">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" />
                  Data Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Efficiently input and manage NPA account data with built-in validation.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/reports">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Generate comprehensive reports for regulatory compliance and internal analysis.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/advanced-features">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2" />
                  Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access cutting-edge tools for enhanced NPA management and recovery.</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Latest Insights</CardTitle>
              <CardDescription>Stay updated with NPA management trends and regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {latestInsights.map((insight, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-700">{insight.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{insight.description}</p>
                    <p className="text-xs text-gray-400">{new Date(insight.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Compliance Updates</CardTitle>
              <CardDescription>Key regulatory requirements and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {complianceUpdates.map((update, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-700">{update.requirement}</h3>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          update.status === "Mandatory" && "bg-red-100 text-red-700",
                          update.status === "Critical" && "bg-orange-100 text-orange-700",
                          update.status === "Important" && "bg-yellow-100 text-yellow-700",
                          update.status === "Regular" && "bg-green-100 text-green-700",
                        )}
                      >
                        {update.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{update.description}</p>
                    <p className="text-xs text-gray-400">Deadline: {update.deadline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Advanced NPA Management</CardTitle>
              <CardDescription>Cutting-edge features for efficient NPA handling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {advancedFeatures.map((feature, index) => (
                  <Link key={index} href={feature.link}>
                    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <feature.icon className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-700">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700">
              Access NPA Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

