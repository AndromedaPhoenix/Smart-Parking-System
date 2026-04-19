export type ParkingSpotStatus = "available" | "occupied" | "reserved" | "disabled"

export interface ParkingSpot {
  id: string
  row: string
  number: number
  status: ParkingSpotStatus
  vehicleId?: string
  reservedBy?: string
  reservedUntil?: Date
  lastUpdated: Date
}

export interface ParkingLevel {
  id: string
  name: string
  spots: ParkingSpot[]
}

export interface ParkingStats {
  total: number
  available: number
  occupied: number
  reserved: number
  disabled: number
  occupancyRate: number
}

export interface RecentActivity {
  id: string
  type: "entry" | "exit" | "reservation" | "cancellation"
  spotId: string
  vehicleId?: string
  timestamp: Date
  description: string
}
