export interface Admin {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "manager"
  createdAt: Date
}

export interface MapSettings {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  parkingLotName: string
  address: string
  markers: ParkingMarker[]
}

export interface ParkingMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  label: string
  type: "entrance" | "exit" | "parking_area" | "accessible"
}

export interface AuthState {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
}
