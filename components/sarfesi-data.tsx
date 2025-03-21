import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SARFESIDataProps {
  data: {
    totalCases: number
    totalAmount: number
    recoveredAmount: number
    pendingCases: number[]
  }
}

export function SARFESIData({ data }: SARFESIDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SARFESI Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Total Cases</TableCell>
              <TableCell className="text-right">{data.totalCases}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Amount</TableCell>
              <TableCell className="text-right">₹{data.totalAmount.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Recovered Amount</TableCell>
              <TableCell className="text-right">₹{data.recoveredAmount.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pending Cases</TableCell>
              <TableCell className="text-right">{data.pendingCases.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

