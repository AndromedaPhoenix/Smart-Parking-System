"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface OccupancyChartProps {
  data: { hour: string; occupancy: number }[]
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Occupancy Rate</CardTitle>
        <p className="text-xs text-muted-foreground">Today&apos;s hourly occupancy</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
                labelStyle={{ color: "oklch(0.65 0 0)" }}
                formatter={(value: number) => [`${value}%`, "Occupancy"]}
              />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="oklch(0.72 0.19 160)"
                strokeWidth={2}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
