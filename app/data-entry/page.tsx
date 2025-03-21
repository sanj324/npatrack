"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil } from "lucide-react"

interface NPAEntry {
  ACC_CODE: string
  NAME: string
  ACTYP: string
  LIMIT: number
  OVER_AMT: number
  NO_ODMTH: number
  SEC_UNSEC_TYP: string
  PRIN_SEC_AMT: number
  REASONS: string
}

export default function DataEntry() {
  const [entries, setEntries] = useState<NPAEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<NPAEntry | null>(null)

  useEffect(() => {
    // Simulating fetching data from the imported file
    const fetchData = async () => {
      // In a real application, you would fetch data from your API or imported file here
      const dummyData: NPAEntry[] = [
        {
          ACC_CODE: "ACC001",
          NAME: "John Doe",
          ACTYP: "TL",
          LIMIT: 100000,
          OVER_AMT: 75000,
          NO_ODMTH: 3,
          SEC_UNSEC_TYP: "SEC",
          PRIN_SEC_AMT: 150000,
          REASONS: "Business downturn",
        },
        {
          ACC_CODE: "ACC002",
          NAME: "Jane Smith",
          ACTYP: "CC",
          LIMIT: 50000,
          OVER_AMT: 40000,
          NO_ODMTH: 2,
          SEC_UNSEC_TYP: "UNSEC",
          PRIN_SEC_AMT: 0,
          REASONS: "Personal financial crisis",
        },
      ]
      setEntries(dummyData)
    }

    fetchData()
  }, [])

  const handleEdit = (entry: NPAEntry) => {
    setEditingEntry(entry)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingEntry) {
      const { name, value } = e.target
      setEditingEntry((prev) => ({
        ...prev!,
        [name]:
          name === "LIMIT" || name === "OVER_AMT" || name === "NO_ODMTH" || name === "PRIN_SEC_AMT"
            ? Number(value)
            : value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (editingEntry) {
      setEditingEntry((prev) => ({ ...prev!, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEntry) {
      setEntries(entries.map((entry) => (entry.ACC_CODE === editingEntry.ACC_CODE ? editingEntry : entry)))
      toast({
        title: "Entry Updated",
        description: "The NPA account data has been successfully updated.",
      })
      setEditingEntry(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">NPA Account Data Entry</h1>

      {editingEntry && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit NPA Account Details</CardTitle>
            <CardDescription>Update the information for the selected NPA account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ACC_CODE">Account Number</Label>
                  <Input
                    id="ACC_CODE"
                    name="ACC_CODE"
                    value={editingEntry.ACC_CODE}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NAME">Customer Name</Label>
                  <Input id="NAME" name="NAME" value={editingEntry.NAME} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ACTYP">Account Type</Label>
                  <Select
                    name="ACTYP"
                    onValueChange={(value) => handleSelectChange("ACTYP", value)}
                    value={editingEntry.ACTYP}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TL">Term Loan</SelectItem>
                      <SelectItem value="CC">Cash Credit</SelectItem>
                      <SelectItem value="OD">Overdraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="LIMIT">Sanctioned Limit (₹)</Label>
                  <Input
                    id="LIMIT"
                    name="LIMIT"
                    type="number"
                    value={editingEntry.LIMIT}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="OVER_AMT">Overdue Amount (₹)</Label>
                  <Input
                    id="OVER_AMT"
                    name="OVER_AMT"
                    type="number"
                    value={editingEntry.OVER_AMT}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NO_ODMTH">Overdue Months</Label>
                  <Input
                    id="NO_ODMTH"
                    name="NO_ODMTH"
                    type="number"
                    value={editingEntry.NO_ODMTH}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SEC_UNSEC_TYP">Security Type</Label>
                  <Select
                    name="SEC_UNSEC_TYP"
                    onValueChange={(value) => handleSelectChange("SEC_UNSEC_TYP", value)}
                    value={editingEntry.SEC_UNSEC_TYP}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEC">Secured</SelectItem>
                      <SelectItem value="UNSEC">Unsecured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="PRIN_SEC_AMT">Principal Security Amount (₹)</Label>
                  <Input
                    id="PRIN_SEC_AMT"
                    name="PRIN_SEC_AMT"
                    type="number"
                    value={editingEntry.PRIN_SEC_AMT}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="REASONS">Reasons for NPA</Label>
                <Textarea id="REASONS" name="REASONS" value={editingEntry.REASONS} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingEntry(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update NPA Account Data</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>NPA Accounts List</CardTitle>
          <CardDescription>View and edit existing NPA account entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Overdue Amount</TableHead>
                <TableHead>Overdue Months</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.ACC_CODE}>
                  <TableCell>{entry.ACC_CODE}</TableCell>
                  <TableCell>{entry.NAME}</TableCell>
                  <TableCell>{entry.ACTYP}</TableCell>
                  <TableCell>₹{entry.OVER_AMT.toLocaleString()}</TableCell>
                  <TableCell>{entry.NO_ODMTH}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(entry)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

