"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart } from "recharts"

const npaData = [
  { name: "D2", value: 35, color: "#0088FE" },
  { name: "D3", value: 25, color: "#00C49F" },
  { name: "LO", value: 25, color: "#FFBB28" },
  { name: "ST", value: 10, color: "#FF8042" },
  { name: "SU", value: 5, color: "#8884d8" },
]

export function NPADistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NPA Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            distribution: {
              label: "NPA Distribution",
            },
            d2: {
              label: "D2",
              color: "#0088FE",
            },
            d3: {
              label: "D3",
              color: "#00C49F",
            },
            lo: {
              label: "LO",
              color: "#FFBB28",
            },
            st: {
              label: "ST",
              color: "#FF8042",
            },
            su: {
              label: "SU",
              color: "#8884d8",
            },
          }}
          className="aspect-square h-[300px]"
        >
          <PieChart>
            <Pie data={npaData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} paddingAngle={0} dataKey="value">
              {npaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="flex-wrap gap-2 [&>*]:basis-1/5 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

