"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { NPARecord } from "@/app/utils/dataImport"
import { columnGroups, columnTypes } from "@/types/npa-data"
import { NPACharts } from "@/components/charts/npa-charts"
import { PlusCircle, Trash2 } from "lucide-react"

interface ReportWriterProps {
  data: NPARecord[]
}

interface MemoryVariable {
  name: string
  formula: string
}

interface AggregationOption {
  column: string
  operation: "sum" | "average" | "count" | "min" | "max"
}

interface GroupingOption {
  column: string
}

export function ReportWriter({ data }: ReportWriterProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterColumn, setFilterColumn] = useState<string>("")
  const [filterValue, setFilterValue] = useState<string>("")
  const [showSummary, setShowSummary] = useState<boolean>(true)
  const [showDetail, setShowDetail] = useState<boolean>(true)
  const [showTotal, setShowTotal] = useState<boolean>(true)
  const [chartType, setChartType] = useState<string>("")
  const [memoryVariables, setMemoryVariables] = useState<MemoryVariable[]>([])
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [reportName, setReportName] = useState<string>("")
  const [aggregationOptions, setAggregationOptions] = useState<AggregationOption[]>([])
  const [groupingOptions, setGroupingOptions] = useState<GroupingOption[]>([])
  const [shouldSaveReport, setShouldSaveReport] = useState<boolean | null>(null)

  const handleColumnSelect = (column: string) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
  }

  const addMemoryVariable = () => {
    setMemoryVariables([...memoryVariables, { name: "", formula: "" }])
  }

  const updateMemoryVariable = (index: number, field: "name" | "formula", value: string) => {
    const updatedVariables = [...memoryVariables]
    updatedVariables[index][field] = value
    setMemoryVariables(updatedVariables)
  }

  const removeMemoryVariable = (index: number) => {
    setMemoryVariables(memoryVariables.filter((_, i) => i !== index))
  }

  const addAggregationOption = () => {
    setAggregationOptions([...aggregationOptions, { column: "", operation: "sum" }])
  }

  const updateAggregationOption = (index: number, field: "column" | "operation", value: string) => {
    const updatedOptions = [...aggregationOptions]
    updatedOptions[index][field] = value as any
    setAggregationOptions(updatedOptions)
  }

  const removeAggregationOption = (index: number) => {
    setAggregationOptions(aggregationOptions.filter((_, i) => i !== index))
  }

  const addGroupingOption = () => {
    setGroupingOptions([...groupingOptions, { column: "" }])
  }

  const updateGroupingOption = (index: number, value: string) => {
    const updatedOptions = [...groupingOptions]
    updatedOptions[index].column = value
    setGroupingOptions(updatedOptions)
  }

  const removeGroupingOption = (index: number) => {
    setGroupingOptions(groupingOptions.filter((_, i) => i !== index))
  }

  const calculateMemoryVariable = (variable: MemoryVariable, record: NPARecord) => {
    try {
      const context = { ...record }
      Object.keys(context).forEach((key) => {
        if (typeof context[key] === "string") {
          context[key] = `"${context[key]}"`
        }
      })
      const formula = new Function(...Object.keys(context), `return ${variable.formula}`)
      return formula(...Object.values(context))
    } catch (error) {
      console.error(`Error calculating memory variable ${variable.name}:`, error)
      return "Error"
    }
  }

  const handleGenerateReport = () => {
    if (!reportName) {
      alert("Please enter a report name before generating the report.")
      return
    }

    console.log("Starting report generation...")
    console.log("Initial data:", data)

    let processedData = [...data]

    // Apply filtering
    if (filterColumn && filterValue) {
      processedData = processedData.filter((record) =>
        String(record[filterColumn as keyof NPARecord])
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      )
    }
    console.log("After filtering:", processedData)

    // Apply sorting
    if (sortColumn) {
      processedData.sort((a, b) => {
        const aValue = a[sortColumn as keyof NPARecord]
        const bValue = b[sortColumn as keyof NPARecord]
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        }
        return String(aValue).localeCompare(String(bValue)) * (sortOrder === "asc" ? 1 : -1)
      })
    }
    console.log("After sorting:", processedData)

    // Apply memory variables
    processedData = processedData.map((record) => {
      const memoryValues: Record<string, any> = {}
      memoryVariables.forEach((variable) => {
        memoryValues[variable.name] = calculateMemoryVariable(variable, record)
      })
      return { ...record, ...memoryValues }
    })
    console.log("After applying memory variables:", processedData)

    // Apply grouping and aggregation
    if (groupingOptions.length > 0) {
      const groupedData = processedData.reduce(
        (acc, record) => {
          const groupKey = groupingOptions.map((option) => String(record[option.column as keyof NPARecord])).join("|")
          if (!acc[groupKey]) {
            acc[groupKey] = []
          }
          acc[groupKey].push(record)
          return acc
        },
        {} as Record<string, NPARecord[]>,
      )

      console.log("Grouped data:", groupedData)

      // Apply aggregations to grouped data
      processedData = Object.entries(groupedData).map(([groupKey, group]) => {
        const groupResult: Record<string, any> = {}
        groupingOptions.forEach((option, index) => {
          groupResult[option.column] = groupKey.split("|")[index]
        })

        aggregationOptions.forEach((option) => {
          const values = group.map((record) => Number(record[option.column as keyof NPARecord]) || 0)
          switch (option.operation) {
            case "sum":
              groupResult[`${option.column}_sum`] = values.reduce((a, b) => a + b, 0)
              break
            case "average":
              groupResult[`${option.column}_avg`] = values.reduce((a, b) => a + b, 0) / values.length
              break
            case "count":
              groupResult[`${option.column}_count`] = values.length
              break
            case "min":
              groupResult[`${option.column}_min`] = Math.min(...values)
              break
            case "max":
              groupResult[`${option.column}_max`] = Math.max(...values)
              break
          }
        })

        return groupResult
      })
    } else if (aggregationOptions.length > 0) {
      // Apply aggregations to non-grouped data
      const aggregations: Record<string, any> = {}
      aggregationOptions.forEach((option) => {
        const values = processedData.map((record) => Number(record[option.column as keyof NPARecord]) || 0)
        switch (option.operation) {
          case "sum":
            aggregations[`${option.column}_sum`] = values.reduce((a, b) => a + b, 0)
            break
          case "average":
            aggregations[`${option.column}_avg`] = values.reduce((a, b) => a + b, 0) / values.length
            break
          case "count":
            aggregations[`${option.column}_count`] = values.length
            break
          case "min":
            aggregations[`${option.column}_min`] = Math.min(...values)
            break
          case "max":
            aggregations[`${option.column}_max`] = Math.max(...values)
            break
        }
      })
      processedData = [aggregations]
    }

    console.log("Final processed data:", processedData)

    const totals = aggregationOptions.reduce(
      (acc, option) => {
        acc[`${option.column}_${option.operation}`] = processedData.reduce(
          (sum, record) => sum + (Number(record[`${option.column}_${option.operation}`]) || 0),
          0,
        )
        return acc
      },
      {} as Record<string, number>,
    )

    const generatedReportData = {
      name: reportName,
      summary: {
        recordCount: processedData.length,
        // Add more summary statistics here if needed
      },
      details: processedData,
      totals: totals,
    }

    console.log("Generated report data:", generatedReportData)
    setGeneratedReport(generatedReportData)

    setShouldSaveReport(null) // Reset the save state
    setTimeout(() => {
      if (confirm("Do you want to permanently save this report?")) {
        setShouldSaveReport(true)
      } else {
        setShouldSaveReport(false)
      }
    }, 100) // Short delay to ensure the report is rendered first
  }

  const saveReport = async () => {
    if (!generatedReport) return

    try {
      const response = await fetch("/api/save-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedReport),
      })

      if (response.ok) {
        alert("Report saved successfully!")
      } else {
        throw new Error("Failed to save report")
      }
    } catch (error) {
      console.error("Error saving report:", error)
      alert("Failed to save report. Please try again.")
    }
  }

  useEffect(() => {
    if (shouldSaveReport === true) {
      saveReport()
    } else if (shouldSaveReport === false) {
      alert("Report was not saved permanently. You can still export it to CSV.")
    }
  }, [shouldSaveReport, saveReport]) // Added saveReport to dependencies

  const exportToCSV = () => {
    if (!generatedReport) return

    const headers = [
      ...groupingOptions.map((option) => option.column),
      ...aggregationOptions.map((option) => `${option.column}_${option.operation}`),
      ...memoryVariables.map((v) => v.name),
    ]
    const csvContent = [
      headers.join(","),
      ...generatedReport.details.map((row: any) => headers.map((header) => row[header]).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${reportName || "npa_report"}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const columnHeaders = useMemo(() => {
    return [
      ...groupingOptions.map((option) => option.column),
      ...aggregationOptions.map((option) => `${option.column}_${option.operation}`),
      ...memoryVariables.map((v) => v.name),
    ]
  }, [groupingOptions, aggregationOptions, memoryVariables])

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom NPA Report Generator</CardTitle>
            <CardDescription>Create tailored reports for NPA analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="columns">
                  <AccordionTrigger>Select Columns</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      {Object.entries(columnGroups).map(([groupKey, group]) => (
                        <div key={groupKey} className="mb-4">
                          <h4 className="mb-2 font-semibold">{group.label}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {group.columns.map((column) => (
                              <div key={column} className="flex items-center space-x-2">
                                <Checkbox
                                  id={column}
                                  checked={selectedColumns.includes(column)}
                                  onCheckedChange={() => handleColumnSelect(column)}
                                />
                                <Label htmlFor={column} className="text-sm">
                                  {column.replace(/_/g, " ")}
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({columnTypes[column] || "string"})
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sort-filter">
                  <AccordionTrigger>Sort and Filter</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sortColumn">Sort Column</Label>
                        <Select value={sortColumn} onValueChange={setSortColumn}>
                          <SelectTrigger id="sortColumn">
                            <SelectValue placeholder="Select column to sort" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sortOrder">Sort Order</Label>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                          <SelectTrigger id="sortOrder">
                            <SelectValue placeholder="Select sort order" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterColumn">Filter Column</Label>
                        <Select value={filterColumn} onValueChange={setFilterColumn}>
                          <SelectTrigger id="filterColumn">
                            <SelectValue placeholder="Select column to filter" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterValue">Filter Value</Label>
                        <Input
                          id="filterValue"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          placeholder="Enter filter value"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="grouping">
                  <AccordionTrigger>Grouping</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {groupingOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Select value={option.column} onValueChange={(value) => updateGroupingOption(index, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grouping column" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedColumns.map((column) => (
                                <SelectItem key={column} value={column}>
                                  {column.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon" onClick={() => removeGroupingOption(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addGroupingOption} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Grouping
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="aggregation">
                  <AccordionTrigger>Aggregation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {aggregationOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Select
                            value={option.column}
                            onValueChange={(value) => updateAggregationOption(index, "column", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedColumns.map((column) => (
                                <SelectItem key={column} value={column}>
                                  {column.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={option.operation}
                            onValueChange={(value) => updateAggregationOption(index, "operation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Sum</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="count">Count</SelectItem>
                              <SelectItem value="min">Min</SelectItem>
                              <SelectItem value="max">Max</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon" onClick={() => removeAggregationOption(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addAggregationOption} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Aggregation
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="memory-variables">
                  <AccordionTrigger>Memory Variables</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {memoryVariables.map((variable, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="Variable Name"
                            value={variable.name}
                            onChange={(e) => updateMemoryVariable(index, "name", e.target.value)}
                          />
                          <Input
                            placeholder="Formula (e.g., OVER_AMT / LIMIT * 100)"
                            value={variable.formula}
                            onChange={(e) => updateMemoryVariable(index, "formula", e.target.value)}
                          />
                          <Button variant="outline" size="icon" onClick={() => removeMemoryVariable(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addMemoryVariable} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Memory Variable
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="report-options">
                  <AccordionTrigger>Report Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showSummary"
                          checked={showSummary}
                          onCheckedChange={(checked) => setShowSummary(checked as boolean)}
                        />
                        <Label htmlFor="showSummary">Show Summary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showDetail"
                          checked={showDetail}
                          onCheckedChange={(checked) => setShowDetail(checked as boolean)}
                        />
                        <Label htmlFor="showDetail">Show Detail</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showTotal"
                          checked={showTotal}
                          onCheckedChange={(checked) => setShowTotal(checked as boolean)}
                        />
                        <Label htmlFor="showTotal">Show Totals</Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chartType">Chart Type</Label>
                        <Select value={chartType} onValueChange={setChartType}>
                          <SelectTrigger id="chartType">
                            <SelectValue placeholder="Select chart type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loanTypeNPA">Bar Chart (Loan Type Distribution)</SelectItem>
                            <SelectItem value="npaTrend">Line Chart (Trend Analysis)</SelectItem>
                            <SelectItem value="securedVsUnsecured">Pie Chart (Secured vs Unsecured)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleGenerateReport} className="w-full">
          Generate Report
        </Button>

        {generatedReport && (
          <Card>
            <CardHeader>
              <CardTitle>{generatedReport.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {shouldSaveReport === true && (
                <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">Saving report...</div>
              )}
              {shouldSaveReport === false && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                  Report not saved permanently. You can still export it to CSV.
                </div>
              )}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  {showSummary && <TabsTrigger value="summary">Summary</TabsTrigger>}
                  {showDetail && <TabsTrigger value="detail">Detail</TabsTrigger>}
                  {showTotal && <TabsTrigger value="total">Total</TabsTrigger>}
                </TabsList>
                {showSummary && (
                  <TabsContent value="summary">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(generatedReport.summary).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{typeof value === "number" ? value.toFixed(2) : value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                )}
                {showDetail && (
                  <TabsContent value="detail">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {columnHeaders.map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generatedReport.details.map((row: any, index: number) => (
                            <TableRow key={index}>
                              {columnHeaders.map((column) => (
                                <TableCell key={column}>
                                  {typeof row[column] === "number" ? row[column].toFixed(2) : row[column]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                )}
                {showTotal && (
                  <TabsContent value="total">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(generatedReport.totals).map(([column, total]) => (
                          <TableRow key={column}>
                            <TableCell>{column}</TableCell>
                            <TableCell>{(total as number).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {chartType && generatedReport && (
          <Card>
            <CardHeader>
              <CardTitle>
                {chartType === "loanTypeNPA" && "Loan Type Distribution"}
                {chartType === "npaTrend" && "NPA Trend Analysis"}
                {chartType === "securedVsUnsecured" && "Secured vs Unsecured Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NPACharts data={generatedReport.details} chartType={chartType} />
            </CardContent>
          </Card>
        )}

        {generatedReport && (
          <Button onClick={exportToCSV} className="w-full">
            Export to CSV
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}

