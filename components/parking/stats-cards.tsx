"use client"

import { Car, CircleParking, Clock, Percent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ParkingStats } from "@/lib/parking-types"

interface StatsCardsProps {
  stats: ParkingStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Spots",
      value: stats.total,
      icon: CircleParking,
      color: "text-foreground",
      bgColor: "bg-secondary",
    },
    {
      title: "Available",
      value: stats.available,
      icon: Car,
      color: "text-available",
      bgColor: "bg-available/10",
    },
    {
      title: "Occupied",
      value: stats.occupied,
      icon: Car,
      color: "text-occupied",
      bgColor: "bg-occupied/10",
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: Percent,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
