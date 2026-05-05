"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Admin, AuthState, MapSettings } from "./auth-types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  mapSettings: MapSettings
  updateMapSettings: (settings: MapSettings) => void
}

const defaultMapSettings: MapSettings = {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 16,
  parkingLotName: "SmartPark Central",
  address: "123 Main Street, New York, NY 10001",
  markers: [
    { id: "1", position: { lat: 40.7128, lng: -74.006 }, label: "Main Entrance", type: "entrance" },
    { id: "2", position: { lat: 40.7125, lng: -74.0055 }, label: "Exit A", type: "exit" },
    { id: "3", position: { lat: 40.713, lng: -74.0065 }, label: "Parking Zone A", type: "parking_area" },
  ],
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock admin storage (in production, this would be a database)
const ADMIN_STORAGE_KEY = "smartpark_admins"
const AUTH_STATE_KEY = "smartpark_auth"
const MAP_SETTINGS_KEY = "smartpark_map_settings"

function getStoredAdmins(): Array<{ email: string; password: string; name: string; id: string; role: string; createdAt: string }> {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveAdmin(admin: { email: string; password: string; name: string; id: string; role: string; createdAt: string }) {
  const admins = getStoredAdmins()
  admins.push(admin)
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    isLoading: true,
  })
  
  const [mapSettings, setMapSettings] = useState<MapSettings>(defaultMapSettings)

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem(AUTH_STATE_KEY)
    const storedMapSettings = localStorage.getItem(MAP_SETTINGS_KEY)
    
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth)
      setAuthState({
        isAuthenticated: true,
        admin: {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        },
        isLoading: false,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
    
    if (storedMapSettings) {
      setMapSettings(JSON.parse(storedMapSettings))
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const admins = getStoredAdmins()
    const admin = admins.find((a) => a.email === email && a.password === password)
    
    if (admin) {
      const adminData: Admin = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role as Admin["role"],
        createdAt: new Date(admin.createdAt),
      }
      
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(adminData))
      setAuthState({
        isAuthenticated: true,
        admin: adminData,
        isLoading: false,
      })
      return true
    }
    
    return false
  }, [])

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    const admins = getStoredAdmins()
    
    if (admins.some((a) => a.email === email)) {
      return false // Email already exists
    }
    
    const newAdmin = {
      id: `admin_${Date.now()}`,
      email,
      password,
      name,
      role: "admin",
      createdAt: new Date().toISOString(),
    }
    
    saveAdmin(newAdmin)
    
    const adminData: Admin = {
      id: newAdmin.id,
      email: newAdmin.email,
      name: newAdmin.name,
      role: "admin",
      createdAt: new Date(newAdmin.createdAt),
    }
    
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(adminData))
    setAuthState({
      isAuthenticated: true,
      admin: adminData,
      isLoading: false,
    })
    
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STATE_KEY)
    setAuthState({
      isAuthenticated: false,
      admin: null,
      isLoading: false,
    })
  }, [])

  const updateMapSettings = useCallback((settings: MapSettings) => {
    setMapSettings(settings)
    localStorage.setItem(MAP_SETTINGS_KEY, JSON.stringify(settings))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        mapSettings,
        updateMapSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
