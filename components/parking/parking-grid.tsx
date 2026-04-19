"use client"

import { useState } from "react"
import { Car, Accessibility, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ParkingLevel, ParkingSpot } from "@/lib/parking-types"
import { cn } from "@/lib/utils"

interface ParkingGridProps {
  levels: ParkingLevel[]
  onSpotClick?: (spot: ParkingSpot) => void
}

function SpotCell({ spot, onClick }: { spot: ParkingSpot; onClick?: () => void }) {
  const statusStyles = {
    available: "bg-available/20 border-available hover:bg-available/30 cursor-pointer",
    occupied: "bg-occupied/20 border-occupied",
    reserved: "bg-reserved/20 border-reserved",
    disabled: "bg-disabled/20 border-disabled",
  }

  const statusIcons = {
    available: null,
    occupied: <Car className="h-4 w-4 text-occupied" />,
    reserved: <Clock className="h-4 w-4 text-reserved" />,
    disabled: <Accessibility className="h-4 w-4 text-disabled" />,
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={spot.status === "available" ? onClick : undefined}
            className={cn(
              "h-12 w-full rounded-md border-2 flex items-center justify-center transition-all",
              statusStyles[spot.status],
              spot.status !== "available" && "cursor-default"
            )}
          >
            {statusIcons[spot.status] || (
              <span className="text-xs font-medium text-available">{spot.row}{spot.number}</span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border-border">
          <div className="text-sm">
            <p className="font-medium">Spot {spot.row}{spot.number}</p>
            <p className="text-muted-foreground capitalize">{spot.status}</p>
            {spot.vehicleId && (
              <p className="text-muted-foreground">Vehicle: {spot.vehicleId}</p>
            )}
            {spot.reservedUntil && (
              <p className="text-muted-foreground">
                Until: {spot.reservedUntil.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ParkingGrid({ levels, onSpotClick }: ParkingGridProps) {
  const [activeLevel, setActiveLevel] = useState(levels[0]?.id || "L1")

  const currentLevel = levels.find((l) => l.id === activeLevel)
  const rows = currentLevel ? [...new Set(currentLevel.spots.map((s) => s.row))].sort() : []

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Parking Layout</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-available/50" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-occupied/50" />
              <span className="text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-reserved/50" />
              <span className="text-muted-foreground">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-disabled/50" />
              <span className="text-muted-foreground">Accessible</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLevel} onValueChange={setActiveLevel}>
          <TabsList className="mb-4 bg-secondary">
            {levels.map((level) => (
              <TabsTrigger key={level.id} value={level.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {level.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((level) => (
            <TabsContent key={level.id} value={level.id}>
              <div className="space-y-3">
                {rows.map((row) => {
                  const rowSpots = level.spots
                    .filter((s) => s.row === row)
                    .sort((a, b) => a.number - b.number)

                  return (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-8 text-sm font-medium text-muted-foreground">
                        {row}
                      </div>
                      <div className="grid grid-cols-12 gap-2 flex-1">
                        {rowSpots.map((spot) => (
                          <SpotCell
                            key={spot.id}
                            spot={spot}
                            onClick={() => onSpotClick?.(spot)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center justify-center">
                <div className="rounded-lg bg-secondary px-8 py-2 text-sm text-muted-foreground">
                  Entry / Exit
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
