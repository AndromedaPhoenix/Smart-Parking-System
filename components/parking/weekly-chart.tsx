"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface WeeklyChartProps {
  data: { day: string; entries: number; exits: number }[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Weekly Traffic</CardTitle>
        <p className="text-xs text-muted-foreground">Entries and exits this week</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
                labelStyle={{ color: "oklch(0.65 0 0)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>}
              />
              <Bar dataKey="entries" fill="oklch(0.72 0.19 160)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exits" fill="oklch(0.7 0.15 250)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
