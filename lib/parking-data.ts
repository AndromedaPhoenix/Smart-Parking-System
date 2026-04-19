import type { ParkingSpot, ParkingLevel, ParkingStats, RecentActivity } from "./parking-types"

function generateSpots(levelId: string, rows: string[], spotsPerRow: number): ParkingSpot[] {
  const spots: ParkingSpot[] = []
  const statuses: ("available" | "occupied" | "reserved" | "disabled")[] = [
    "available",
    "occupied",
    "reserved",
    "disabled",
  ]

  rows.forEach((row) => {
    for (let i = 1; i <= spotsPerRow; i++) {
      // Weighted random status (more available and occupied)
      const rand = Math.random()
      let status: "available" | "occupied" | "reserved" | "disabled"
      if (rand < 0.35) status = "available"
      else if (rand < 0.75) status = "occupied"
      else if (rand < 0.92) status = "reserved"
      else status = "disabled"

      spots.push({
        id: `${levelId}-${row}${i}`,
        row,
        number: i,
        status,
        vehicleId: status === "occupied" ? `VEH-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : undefined,
        reservedBy: status === "reserved" ? `User-${Math.floor(Math.random() * 1000)}` : undefined,
        reservedUntil: status === "reserved" ? new Date(Date.now() + Math.random() * 3600000 * 4) : undefined,
        lastUpdated: new Date(Date.now() - Math.random() * 3600000),
      })
    }
  })

  return spots
}

export const parkingLevels: ParkingLevel[] = [
  {
    id: "L1",
    name: "Level 1 - Ground",
    spots: generateSpots("L1", ["A", "B", "C", "D"], 12),
  },
  {
    id: "L2",
    name: "Level 2",
    spots: generateSpots("L2", ["A", "B", "C", "D"], 12),
  },
  {
    id: "L3",
    name: "Level 3",
    spots: generateSpots("L3", ["A", "B", "C"], 12),
  },
]

export function calculateStats(levels: ParkingLevel[]): ParkingStats {
  const allSpots = levels.flatMap((l) => l.spots)
  const total = allSpots.length
  const available = allSpots.filter((s) => s.status === "available").length
  const occupied = allSpots.filter((s) => s.status === "occupied").length
  const reserved = allSpots.filter((s) => s.status === "reserved").length
  const disabled = allSpots.filter((s) => s.status === "disabled").length

  return {
    total,
    available,
    occupied,
    reserved,
    disabled,
    occupancyRate: Math.round(((occupied + reserved) / (total - disabled)) * 100),
  }
}

export const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "entry",
    spotId: "L1-A3",
    vehicleId: "ABC-1234",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    description: "Vehicle ABC-1234 entered spot A3",
  },
  {
    id: "2",
    type: "exit",
    spotId: "L2-B7",
    vehicleId: "XYZ-5678",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    description: "Vehicle XYZ-5678 exited spot B7",
  },
  {
    id: "3",
    type: "reservation",
    spotId: "L1-C5",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    description: "Spot C5 reserved for 2 hours",
  },
  {
    id: "4",
    type: "entry",
    spotId: "L3-A10",
    vehicleId: "DEF-9012",
    timestamp: new Date(Date.now() - 1000 * 60 * 22),
    description: "Vehicle DEF-9012 entered spot A10",
  },
  {
    id: "5",
    type: "cancellation",
    spotId: "L2-D2",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    description: "Reservation cancelled for spot D2",
  },
  {
    id: "6",
    type: "exit",
    spotId: "L1-B8",
    vehicleId: "GHI-3456",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    description: "Vehicle GHI-3456 exited spot B8",
  },
]

export const hourlyOccupancy = [
  { hour: "6AM", occupancy: 15 },
  { hour: "7AM", occupancy: 32 },
  { hour: "8AM", occupancy: 65 },
  { hour: "9AM", occupancy: 82 },
  { hour: "10AM", occupancy: 88 },
  { hour: "11AM", occupancy: 85 },
  { hour: "12PM", occupancy: 78 },
  { hour: "1PM", occupancy: 72 },
  { hour: "2PM", occupancy: 80 },
  { hour: "3PM", occupancy: 85 },
  { hour: "4PM", occupancy: 90 },
  { hour: "5PM", occupancy: 75 },
  { hour: "6PM", occupancy: 55 },
  { hour: "7PM", occupancy: 35 },
  { hour: "8PM", occupancy: 20 },
]

export const weeklyStats = [
  { day: "Mon", entries: 245, exits: 238 },
  { day: "Tue", entries: 312, exits: 305 },
  { day: "Wed", entries: 287, exits: 290 },
  { day: "Thu", entries: 298, exits: 295 },
  { day: "Fri", entries: 356, exits: 348 },
  { day: "Sat", entries: 189, exits: 195 },
  { day: "Sun", entries: 124, exits: 128 },
]
