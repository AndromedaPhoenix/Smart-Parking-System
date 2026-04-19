"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/parking/header"
import { StatsCards } from "@/components/parking/stats-cards"
import { ParkingGrid } from "@/components/parking/parking-grid"
import { ActivityFeed } from "@/components/parking/activity-feed"
import { OccupancyChart } from "@/components/parking/occupancy-chart"
import { WeeklyChart } from "@/components/parking/weekly-chart"
import { QuickActions } from "@/components/parking/quick-actions"
import { ReservationModal } from "@/components/parking/reservation-modal"
import {
  parkingLevels,
  calculateStats,
  recentActivities,
  hourlyOccupancy,
  weeklyStats,
} from "@/lib/parking-data"
import type { ParkingSpot, RecentActivity } from "@/lib/parking-types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function SmartParkingDashboard() {
  const [levels, setLevels] = useState(parkingLevels)
  const [activities, setActivities] = useState<RecentActivity[]>(recentActivities)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const stats = calculateStats(levels)

  const handleSpotClick = useCallback((spot: ParkingSpot) => {
    if (spot.status === "available") {
      setSelectedSpot(spot)
      setModalOpen(true)
    }
  }, [])

  const handleReserve = useCallback(
    (spotId: string, duration: string, vehicleId: string) => {
      setLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          spots: level.spots.map((spot) =>
            spot.id === spotId
              ? {
                  ...spot,
                  status: "reserved" as const,
                  reservedBy: vehicleId,
                  reservedUntil: new Date(Date.now() + parseInt(duration) * 3600000),
                  lastUpdated: new Date(),
                }
              : spot
          ),
        }))
      )

      const newActivity: RecentActivity = {
        id: Date.now().toString(),
        type: "reservation",
        spotId,
        timestamp: new Date(),
        description: `Spot ${spotId.split("-")[1]} reserved for ${duration} hour(s)`,
      }

      setActivities((prev) => [newActivity, ...prev])
      
      toast.success("Spot Reserved!", {
        description: `Spot ${spotId.split("-")[1]} has been reserved for ${duration} hour(s)`,
      })
    },
    []
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Real-time parking management overview
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Updates
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ParkingGrid levels={levels} onSpotClick={handleSpotClick} />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <ActivityFeed activities={activities} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OccupancyChart data={hourlyOccupancy} />
          <WeeklyChart data={weeklyStats} />
        </div>
      </main>

      <ReservationModal
        spot={selectedSpot}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onReserve={handleReserve}
      />

      <Toaster />
    </div>
  )
}
