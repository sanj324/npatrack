"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

// Import icons
import { FileText, Calculator, LineChart, Bell, Gavel, Receipt, Clock, Target, FileBarChart } from "lucide-react"

const tabStyles = {
  sarfaesi: "bg-blue-50 dark:bg-blue-950",
  status: "bg-purple-50 dark:bg-purple-950",
  writeoffs: "bg-green-50 dark:bg-green-950",
  monitoring: "bg-amber-50 dark:bg-amber-950",
  legal: "bg-red-50 dark:bg-red-950",
  expenses: "bg-cyan-50 dark:bg-cyan-950",
  reminders: "bg-pink-50 dark:bg-pink-950",
  ots: "bg-indigo-50 dark:bg-indigo-950",
}

const headerStyles = {
  sarfaesi: "bg-blue-100 dark:bg-blue-900",
  status: "bg-purple-100 dark:bg-purple-900",
  writeoffs: "bg-green-100 dark:bg-green-900",
  monitoring: "bg-amber-100 dark:bg-amber-900",
  legal: "bg-red-100 dark:bg-red-900",
  expenses: "bg-cyan-100 dark:bg-cyan-900",
  reminders: "bg-pink-100 dark:bg-pink-900",
  ots: "bg-indigo-100 dark:bg-indigo-900",
}

const iconStyles = {
  sarfaesi: "text-blue-600 dark:text-blue-400",
  status: "text-purple-600 dark:text-purple-400",
  writeoffs: "text-green-600 dark:text-green-400",
  monitoring: "text-amber-600 dark:text-amber-400",
  legal: "text-red-600 dark:text-red-400",
  expenses: "text-cyan-600 dark:text-cyan-400",
  reminders: "text-pink-600 dark:text-pink-400",
  ots: "text-indigo-600 dark:text-indigo-400",
}

const sarfaesiSteps = [
  {
    id: "notice-13-2",
    title: "Section 13(2) Notice",
    description: "Demand notice for repayment of secured debt",
    requirements: [
      "60 days notice period mandatory",
      "Details of secured assets to be mentioned",
      "Amount of debt to be clearly stated",
      "Mode of service of notice as per rules",
    ],
    fields: [
      { name: "noticeDate", label: "Notice Date", type: "date" },
      { name: "demandAmount", label: "Demand Amount", type: "number" },
      { name: "securedAssets", label: "Secured Assets Details", type: "textarea" },
      {
        name: "serviceMode",
        label: "Mode of Service",
        type: "select",
        options: ["Registered Post", "Hand Delivery", "Publication", "Electronic"],
      },
    ],
  },
  {
    id: "notice-13-4",
    title: "Section 13(4) Action",
    description: "Enforcement of security interest",
    requirements: [
      "Taking possession of secured assets",
      "Sale or lease of secured assets",
      "Take over management of business",
      "Appointment of manager",
    ],
    fields: [
      { name: "possessionType", label: "Possession Type", type: "select", options: ["Symbolic", "Physical"] },
      { name: "possessionDate", label: "Possession Date", type: "date" },
      { name: "assetValuation", label: "Asset Valuation Amount", type: "number" },
      { name: "valuationAgency", label: "Valuation Agency", type: "text" },
    ],
  },
  {
    id: "rule-8-6",
    title: "Rule 8 & 9 Sale Notice",
    description: "Public notice for sale of secured assets",
    requirements: [
      "30 days notice period",
      "Publication in newspapers",
      "Reserve price fixation",
      "E-auction procedures",
    ],
    fields: [
      { name: "saleNoticeDate", label: "Sale Notice Date", type: "date" },
      { name: "reservePrice", label: "Reserve Price", type: "number" },
      { name: "emdAmount", label: "EMD Amount", type: "number" },
      { name: "publicationDetails", label: "Publication Details", type: "textarea" },
      { name: "auctionDate", label: "E-Auction Date", type: "date" },
    ],
  },
  {
    id: "dm-cmm",
    title: "DM/CMM Application",
    description: "Application to District Magistrate/Chief Metropolitan Magistrate",
    requirements: [
      "Physical possession taking",
      "Police assistance request",
      "Panchnama preparation",
      "Inventory documentation",
    ],
    fields: [
      { name: "applicationDate", label: "Application Date", type: "date" },
      { name: "dmCmmDetails", label: "DM/CMM Details", type: "text" },
      { name: "policeStation", label: "Police Station", type: "text" },
      { name: "inventoryDetails", label: "Inventory Details", type: "textarea" },
    ],
  },
]

const legalActionSteps = [
  {
    id: "case-filing",
    title: "Case Filing",
    description: "Initiate legal proceedings",
    fields: [
      {
        name: "caseType",
        label: "Case Type",
        type: "select",
        options: ["Civil Suit", "DRT Case", "SARFAESI Action", "Recovery Suit"],
      },
      { name: "caseNumber", label: "Case Number", type: "text" },
      { name: "filingDate", label: "Filing Date", type: "date" },
      { name: "courtName", label: "Court/Tribunal Name", type: "text" },
      { name: "advocateName", label: "Advocate Name", type: "text" },
      { name: "advocateContact", label: "Advocate Contact", type: "tel" },
    ],
  },
  {
    id: "hearing-details",
    title: "Hearing Details",
    description: "Track court hearings and proceedings",
    fields: [
      { name: "hearingDate", label: "Next Hearing Date", type: "date" },
      { name: "hearingPurpose", label: "Hearing Purpose", type: "text" },
      { name: "lastOrderDetails", label: "Last Order Details", type: "textarea" },
      { name: "nextSteps", label: "Next Steps", type: "textarea" },
    ],
  },
  {
    id: "document-filing",
    title: "Document Filing",
    description: "Manage legal document submissions",
    fields: [
      {
        name: "documentType",
        label: "Document Type",
        type: "select",
        options: ["Plaint", "Written Statement", "Rejoinder", "Affidavit", "Other"],
      },
      { name: "filingDate", label: "Filing Date", type: "date" },
      { name: "acknowledgmentNo", label: "Acknowledgment Number", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "order-details",
    title: "Order Details",
    description: "Record court orders and judgments",
    fields: [
      { name: "orderDate", label: "Order Date", type: "date" },
      {
        name: "orderType",
        label: "Order Type",
        type: "select",
        options: ["Interim Order", "Final Judgment", "Decree", "Other"],
      },
      { name: "orderSummary", label: "Order Summary", type: "textarea" },
      { name: "nextActionDate", label: "Next Action Date", type: "date" },
      { name: "nextAction", label: "Next Action", type: "textarea" },
    ],
  },
]

interface NPARecord {
  ACC_CODE?: string
  NAME?: string
  OVER_AMT?: number
  // Add other fields as needed
}

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState("sarfaesi")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [npaAccountData, setNpaAccountData] = useState<NPARecord | null>(null)
  const toast = useToast()

  const fetchNPAAccountData = async (accountNumber: string) => {
    try {
      const response = await fetch(`/api/npa-data/${accountNumber}`)
      if (!response.ok) {
        throw new Error("Failed to fetch NPA account data")
      }
      const data = await response.json()
      setNpaAccountData(data)
    } catch (error) {
      console.error("Error fetching NPA account data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch NPA account data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveNPAAccountData = async () => {
    try {
      const response = await fetch("/api/npa-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(npaAccountData),
      })
      if (!response.ok) {
        throw new Error("Failed to save NPA account data")
      }
      toast({
        title: "Success",
        description: "NPA account data saved successfully.",
      })
    } catch (error) {
      console.error("Error saving NPA account data:", error)
      toast({
        title: "Error",
        description: "Failed to save NPA account data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderReportingSection = (tabName: string) => {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileBarChart className={`mr-2 ${iconStyles[tabName as keyof typeof iconStyles]}`} />
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)} Reporting
          </CardTitle>
          <CardDescription>Generate reports based on the latest administrative guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Filters</Label>
              <Input placeholder="Enter any additional filters" />
            </div>
            <Button className={`w-full bg-${tabName}-600 hover:bg-${tabName}-700`}>Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className={cn("rounded-lg p-6 mb-6", headerStyles[activeTab as keyof typeof headerStyles])}>
        <h1 className="text-3xl font-bold mb-2">Advanced NPA Management Features</h1>
        <p className="text-muted-foreground">Comprehensive tools for efficient NPA management and recovery</p>
      </div>

      <Tabs defaultValue="sarfaesi" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent h-auto p-0">
          <TabsTrigger
            value="sarfaesi"
            className={cn(
              "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <FileText className={iconStyles.sarfaesi} />
            <span>SARFAESI Action</span>
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className={cn(
              "data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <LineChart className={iconStyles.status} />
            <span>Status Notes</span>
          </TabsTrigger>
          <TabsTrigger
            value="writeoffs"
            className={cn(
              "data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Calculator className={iconStyles.writeoffs} />
            <span>Prudential Write-offs</span>
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            className={cn(
              "data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Target className={iconStyles.monitoring} />
            <span>Customized Monitoring</span>
          </TabsTrigger>
          <TabsTrigger
            value="legal"
            className={cn(
              "data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Gavel className={iconStyles.legal} />
            <span>Legal Action</span>
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className={cn(
              "data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Receipt className={iconStyles.expenses} />
            <span>Expense Tracking</span>
          </TabsTrigger>
          <TabsTrigger
            value="reminders"
            className={cn(
              "data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Bell className={iconStyles.reminders} />
            <span>Automated Reminders</span>
          </TabsTrigger>
          <TabsTrigger
            value="ots"
            className={cn(
              "data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900",
              "h-24 flex flex-col items-center justify-center gap-2",
            )}
          >
            <Clock className={iconStyles.ots} />
            <span>OTS Scorecard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sarfaesi" className={tabStyles.sarfaesi}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">SARFAESI Action Management</CardTitle>
              <CardDescription>
                Manage SARFAESI proceedings as per the SARFAESI Act, 2002 and Security Interest (Enforcement) Rules,
                2002
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="account-number"
                      placeholder="Enter account number"
                      className="bg-white"
                      value={npaAccountData?.ACC_CODE || ""}
                      onChange={(e) => setNpaAccountData({ ...npaAccountData, ACC_CODE: e.target.value } as NPARecord)}
                    />
                    <Button onClick={() => fetchNPAAccountData(npaAccountData?.ACC_CODE || "")}>Fetch</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="borrower-name">Borrower Name</Label>
                  <Input
                    id="borrower-name"
                    placeholder="Enter borrower name"
                    className="bg-white"
                    value={npaAccountData?.NAME || ""}
                    onChange={(e) => setNpaAccountData({ ...npaAccountData, NAME: e.target.value } as NPARecord)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstanding-amount">Outstanding Amount</Label>
                  <Input
                    id="outstanding-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="bg-white"
                    value={npaAccountData?.OVER_AMT || ""}
                    onChange={(e) =>
                      setNpaAccountData({ ...npaAccountData, OVER_AMT: Number(e.target.value) } as NPARecord)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="security-type">Security Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immovable">Immovable Property</SelectItem>
                      <SelectItem value="movable">Movable Property</SelectItem>
                      <SelectItem value="receivables">Receivables</SelectItem>
                      <SelectItem value="mixed">Mixed Securities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="security-value">Security Value</Label>
                  <Input id="security-value" type="number" placeholder="Enter value" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input id="branch" placeholder="Enter branch" className="bg-white" />
                </div>
              </div>

              {/* SARFAESI Steps */}
              <Accordion type="single" collapsible className="w-full">
                {sarfaesiSteps.map((step) => (
                  <AccordionItem value={step.id} key={step.id}>
                    <AccordionTrigger className="text-blue-700 hover:text-blue-800 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-6 bg-white rounded-b-lg border border-blue-100 dark:border-blue-800">
                      <div className="text-sm text-muted-foreground mb-4">{step.description}</div>

                      {/* Requirements Checklist */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Requirements Checklist:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.requirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${step.id}-req-${index}`}
                                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`${step.id}-req-${index}`} className="text-sm">
                                {req}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.fields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            {field.type === "select" ? (
                              <Select>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option) => (
                                    <SelectItem key={option} value={option.toLowerCase()}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "textarea" ? (
                              <Textarea
                                id={field.name}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="bg-white min-h-[100px]"
                              />
                            ) : (
                              <Input
                                id={field.name}
                                type={field.type}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="bg-white"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Document Upload */}
                      <div className="space-y-2">
                        <Label>Upload Supporting Documents</Label>
                        <Input type="file" multiple className="bg-white" />
                      </div>

                      {/* Remarks */}
                      <div className="space-y-2">
                        <Label>Additional Remarks</Label>
                        <Textarea placeholder="Enter any additional remarks" className="bg-white" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save Progress</Button>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                          Generate {step.title}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Timeline View */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>SARFAESI Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-blue-200 ml-3 space-y-6">
                    {sarfaesiSteps.map((step, index) => (
                      <div key={index} className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                          <span className="text-blue-800 text-sm">{index + 1}</span>
                        </span>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Status: Pending</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Final Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Save Draft
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveNPAAccountData}>
                  Save NPA Account Data
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Proceed to Next Step</Button>
              </div>
            </CardContent>
          </Card>
          {renderReportingSection("sarfaesi")}
        </TabsContent>

        <TabsContent value="status" className={tabStyles.status}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Status Notes</CardTitle>
              <CardDescription>Track and manage NPA account status updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="Enter account number" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label>Status Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select status type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recovery">Recovery Action</SelectItem>
                      <SelectItem value="legal">Legal Proceedings</SelectItem>
                      <SelectItem value="customer">Customer Interaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Details</Label>
                <Textarea placeholder="Enter status details" className="bg-white min-h-[100px]" />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Status Note</Button>
            </CardContent>
          </Card>
          {renderReportingSection("status")}
        </TabsContent>

        <TabsContent value="writeoffs" className={tabStyles.writeoffs}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Prudential Write-offs</CardTitle>
              <CardDescription>Manage and track write-off requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="Enter account number" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label>Write-off Amount</Label>
                  <Input type="number" placeholder="Enter amount" className="bg-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Justification</Label>
                <Textarea placeholder="Enter write-off justification" className="bg-white min-h-[100px]" />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Submit Write-off Request</Button>
            </CardContent>
          </Card>
          {renderReportingSection("writeoffs")}
        </TabsContent>

        <TabsContent value="monitoring" className={tabStyles.monitoring}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Customized Monitoring</CardTitle>
              <CardDescription>Set up and manage monitoring parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monitoring Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overdue">Days Overdue</SelectItem>
                      <SelectItem value="amount">Outstanding Amount</SelectItem>
                      <SelectItem value="security">Security Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Threshold Value</Label>
                  <Input type="number" placeholder="Enter threshold" className="bg-white" />
                </div>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Set Up Monitoring</Button>
            </CardContent>
          </Card>
          {renderReportingSection("monitoring")}
        </TabsContent>

        <TabsContent value="legal" className={tabStyles.legal}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Legal Action Management</CardTitle>
              <CardDescription>Track and manage legal proceedings under various acts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information for Legal Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="legal-account-number">Account Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="legal-account-number"
                      placeholder="Enter account number"
                      className="bg-white"
                      value={npaAccountData?.ACC_CODE || ""}
                      onChange={(e) => setNpaAccountData({ ...npaAccountData, ACC_CODE: e.target.value } as NPARecord)}
                    />
                    <Button onClick={() => fetchNPAAccountData(npaAccountData?.ACC_CODE || "")}>Fetch</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal-borrower-name">Borrower Name</Label>
                  <Input
                    id="legal-borrower-name"
                    placeholder="Enter borrower name"
                    className="bg-white"
                    value={npaAccountData?.NAME || ""}
                    onChange={(e) => setNpaAccountData({ ...npaAccountData, NAME: e.target.value } as NPARecord)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal-outstanding-amount">Outstanding Amount</Label>
                  <Input
                    id="legal-outstanding-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="bg-white"
                    value={npaAccountData?.OVER_AMT || ""}
                    onChange={(e) =>
                      setNpaAccountData({ ...npaAccountData, OVER_AMT: Number(e.target.value) } as NPARecord)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal-security-type">Security Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="hypothecation">Hypothecation</SelectItem>
                      <SelectItem value="pledge">Pledge</SelectItem>
                      <SelectItem value="unsecured">Unsecured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  {" "}
                  <Label htmlFor="legal-branch">Branch</Label>
                  <Input id="legal-branch" placeholder="Enter branch" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label>Notice Period</Label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </div>

              {/* Legal Action Steps */}
              <Accordion type="single" collapsible className="w-full">
                {legalActionSteps.map((step) => (
                  <AccordionItem value={step.id} key={step.id}>
                    <AccordionTrigger className="text-red-700 hover:text-red-800 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-t-lg">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-6 bg-white rounded-b-lg border border-red-800">
                      <div className="text-sm text-muted-foreground mb-4">{step.description}</div>

                      {/* Dynamic Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.fields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            {field.type === "select" ? (
                              <Select>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option) => (
                                    <SelectItem key={option} value={option.toLowerCase()}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "textarea" ? (
                              <Textarea
                                id={field.name}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="bg-white min-h-[100px]"
                              />
                            ) : (
                              <Input
                                id={field.name}
                                type={field.type}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="bg-white"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Document Upload */}
                      <div className="space-y-2">
                        <Label>Upload Supporting Documents</Label>
                        <Input type="file" multiple className="bg-white" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button className="bg-red-600 hover:bg-red-700">Save Progress</Button>
                        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                          Generate Report
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Timeline View */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Legal Action Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-red-200 ml-3 space-y-6">
                    {legalActionSteps.map((step, index) => (
                      <div key={index} className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                          <span className="text-red800 text-sm">{index + 1}</span>
                        </span>
                        <h3 className="font-semibold text-red-800 dark:text-red-200">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">Status: Pending</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Final Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Save Draft
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={saveNPAAccountData}>
                  Save Legal Action Data
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">Submit Legal Action</Button>
              </div>
            </CardContent>
          </Card>
          {renderReportingSection("legal")}
        </TabsContent>

        <TabsContent value="expenses" className={tabStyles.expenses}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Expense Tracking</CardTitle>
              <CardDescription>Monitor and manage recovery expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expense Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal">Legal Fees</SelectItem>
                      <SelectItem value="valuation">Valuation Charges</SelectItem>
                      <SelectItem value="publication">Publication Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="Enter amount" className="bg-white" />
                </div>
              </div>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Record Expense</Button>
            </CardContent>
          </Card>
          {renderReportingSection("expenses")}
        </TabsContent>

        <TabsContent value="reminders" className={tabStyles.reminders}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Automated Reminders</CardTitle>
              <CardDescription>Set up and manage automated notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment Due</SelectItem>
                      <SelectItem value="meeting">Meeting Schedule</SelectItem>
                      <SelectItem value="document">Document Submission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Input type="datetime-local" className="bg-white" />
                </div>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Set Reminder</Button>
            </CardContent>
          </Card>
          {renderReportingSection("reminders")}
        </TabsContent>

        <TabsContent value="ots" className={tabStyles.ots}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">OTS Scorecard Generation</CardTitle>
              <CardDescription>Create One-Time Settlement evaluation and generate scorecard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information for OTS Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="ots-account-number">Account Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="ots-account-number"
                      placeholder="Enter account number"
                      className="bg-white"
                      value={npaAccountData?.ACC_CODE || ""}
                      onChange={(e) => setNpaAccountData({ ...npaAccountData, ACC_CODE: e.target.value } as NPARecord)}
                    />
                    <Button onClick={() => fetchNPAAccountData(npaAccountData?.ACC_CODE || "")}>Fetch</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-borrower-name">Borrower Name</Label>
                  <Input
                    id="ots-borrower-name"
                    placeholder="Enter borrower name"
                    className="bg-white"
                    value={npaAccountData?.NAME || ""}
                    onChange={(e) => setNpaAccountData({ ...npaAccountData, NAME: e.target.value } as NPARecord)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-outstanding-amount">Outstanding Amount</Label>
                  <Input
                    id="ots-outstanding-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="bg-white"
                    value={npaAccountData?.OVER_AMT || ""}
                    onChange={(e) =>
                      setNpaAccountData({ ...npaAccountData, OVER_AMT: Number(e.target.value) } as NPARecord)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-security-value">Security Value</Label>
                  <Input
                    id="ots-security-value"
                    type="number"
                    placeholder="Enter security value"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-proposed-settlement">Proposed Settlement Amount</Label>
                  <Input
                    id="ots-proposed-settlement"
                    type="number"
                    placeholder="Enter proposed amount"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-account-category">Account Category</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="substandard">Sub-standard</SelectItem>
                      <SelectItem value="doubtful">Doubtful</SelectItem>
                      <SelectItem value="loss">Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-npa-age">NPA Age (in months)</Label>
                  <Input id="ots-npa-age" type="number" placeholder="Enter NPA age" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-last-payment-date">Last Payment Date</Label>
                  <Input id="ots-last-payment-date" type="date" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-willful-default">Willful Default</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="ots-legal-action-status">Legal Action Status</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-action">No Action Taken</SelectItem>
                      <SelectItem value="notice-issued">Notice Issued</SelectItem>
                      <SelectItem value="case-filed">Case Filed</SelectItem>
                      <SelectItem value="decree-obtained">Decree Obtained</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-borrower-profile">Borrower Profile</Label>
                  <Textarea
                    id="ots-borrower-profile"
                    placeholder="Enter borrower profile details"
                    className="bg-white min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ots-reason-for-npa">Reason for NPA</Label>
                  <Textarea
                    id="ots-reason-for-npa"
                    placeholder="Enter reason for NPA"
                    className="bg-white min-h-[100px]"
                  />
                </div>
              </div>

              {/* OTS Calculation */}
              <Card>
                <CardHeader>
                  <CardTitle>OTS Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Principal Outstanding</Label>
                      <Input type="number" placeholder="Enter principal amount" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Outstanding</Label>
                      <Input type="number" placeholder="Enter interest amount" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Other Charges</Label>
                      <Input type="number" placeholder="Enter other charges" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Dues</Label>
                      <Input type="number" placeholder="Calculated total dues" className="bg-white" disabled />
                    </div>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Calculate OTS Amount</Button>
                </CardContent>
              </Card>

              {/* Scorecard Generation */}
              <Card>
                <CardHeader>
                  <CardTitle>Scorecard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recovery Percentage</Label>
                      <Input type="number" placeholder="Calculated percentage" className="bg-white" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Since NPA</Label>
                      <Input type="text" placeholder="Calculated time" className="bg-white" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Security Coverage</Label>
                      <Input type="number" placeholder="Calculated coverage" className="bg-white" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Overall Score</Label>
                      <Input type="number" placeholder="Calculated score" className="bg-white" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recommendation</Label>
                    <Textarea
                      placeholder="System-generated recommendation"
                      className="bg-white min-h-[100px]"
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Final Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  Save Draft
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={saveNPAAccountData}>
                  Save OTS Data
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Generate OTS Proposal</Button>
              </div>
            </CardContent>
          </Card>
          {renderReportingSection("ots")}
        </TabsContent>
      </Tabs>
    </div>
  )
}

