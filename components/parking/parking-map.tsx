"use client"

import { useEffect, useRef, useState } from "react"
import type { MapSettings, ParkingMarker } from "@/lib/auth-types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Trash2, Save, Navigation } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components with no SSR
const MapWithNoSSR = dynamic(
  () => import("./map-client").then((mod) => mod.MapClient),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-secondary rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    )
  }
)

interface ParkingMapProps {
  settings: MapSettings
  onSettingsChange: (settings: MapSettings) => void
}

export function ParkingMap({ settings, onSettingsChange }: ParkingMapProps) {
  const [editingMarker, setEditingMarker] = useState<string | null>(null)
  const [newMarkerLabel, setNewMarkerLabel] = useState("")
  const [newMarkerType, setNewMarkerType] = useState<ParkingMarker["type"]>("parking_area")
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const mapRef = useRef<{ getCenter: () => { lat: number; lng: number }; getZoom: () => number } | null>(null)

  const handleAddMarker = () => {
    if (!newMarkerLabel.trim()) {
      toast.error("Please enter a label for the marker")
      return
    }

    const newMarker: ParkingMarker = {
      id: `marker_${Date.now()}`,
      position: { ...settings.center },
      label: newMarkerLabel,
      type: newMarkerType,
    }

    onSettingsChange({
      ...settings,
      markers: [...settings.markers, newMarker],
    })

    setNewMarkerLabel("")
    setIsAddingMarker(false)
    toast.success("Marker added successfully")
  }

  const handleRemoveMarker = (markerId: string) => {
    onSettingsChange({
      ...settings,
      markers: settings.markers.filter((m) => m.id !== markerId),
    })
    toast.success("Marker removed")
  }

  const handleMarkerPositionChange = (markerId: string, position: { lat: number; lng: number }) => {
    onSettingsChange({
      ...settings,
      markers: settings.markers.map((m) =>
        m.id === markerId ? { ...m, position } : m
      ),
    })
  }

  const handleSaveSettings = () => {
    onSettingsChange(settings)
    toast.success("Map settings saved!")
  }

  const handleCenterChange = (center: { lat: number; lng: number }) => {
    onSettingsChange({
      ...settings,
      center,
    })
  }

  const handleZoomChange = (zoom: number) => {
    onSettingsChange({
      ...settings,
      zoom,
    })
  }

  const getMarkerIcon = (type: ParkingMarker["type"]) => {
    switch (type) {
      case "entrance":
        return "text-primary"
      case "exit":
        return "text-destructive"
      case "parking_area":
        return "text-chart-3"
      case "accessible":
        return "text-chart-2"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Parking Location Map
          </CardTitle>
          <CardDescription>
            Configure your parking lot location and add markers for entrances, exits, and parking areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parkingLotName">Parking Lot Name</Label>
              <Input
                id="parkingLotName"
                value={settings.parkingLotName}
                onChange={(e) =>
                  onSettingsChange({ ...settings, parkingLotName: e.target.value })
                }
                className="bg-secondary border-border"
                placeholder="SmartPark Central"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) =>
                  onSettingsChange({ ...settings, address: e.target.value })
                }
                className="bg-secondary border-border"
                placeholder="123 Main Street, City, State"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={settings.center.lat}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    center: { ...settings.center, lat: parseFloat(e.target.value) || 0 },
                  })
                }
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={settings.center.lng}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    center: { ...settings.center, lng: parseFloat(e.target.value) || 0 },
                  })
                }
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zoom">Zoom Level</Label>
              <Input
                id="zoom"
                type="number"
                min={1}
                max={20}
                value={settings.zoom}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    zoom: parseInt(e.target.value) || 16,
                  })
                }
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="h-[400px] rounded-lg overflow-hidden border border-border">
            <MapWithNoSSR
              center={settings.center}
              zoom={settings.zoom}
              markers={settings.markers}
              onMarkerDrag={handleMarkerPositionChange}
              onCenterChange={handleCenterChange}
              onZoomChange={handleZoomChange}
              ref={mapRef}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Map Markers
            </span>
            <Button
              size="sm"
              onClick={() => setIsAddingMarker(!isAddingMarker)}
              variant={isAddingMarker ? "secondary" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Marker
            </Button>
          </CardTitle>
          <CardDescription>
            Manage location markers for entrances, exits, and parking areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingMarker && (
            <div className="p-4 rounded-lg bg-secondary space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="markerLabel">Label</Label>
                  <Input
                    id="markerLabel"
                    value={newMarkerLabel}
                    onChange={(e) => setNewMarkerLabel(e.target.value)}
                    className="bg-background border-border"
                    placeholder="Main Entrance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="markerType">Type</Label>
                  <Select
                    value={newMarkerType}
                    onValueChange={(value) => setNewMarkerType(value as ParkingMarker["type"])}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrance">Entrance</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="parking_area">Parking Area</SelectItem>
                      <SelectItem value="accessible">Accessible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddingMarker(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMarker}>
                  Add Marker
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {settings.markers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No markers added yet. Click "Add Marker" to create one.
              </div>
            ) : (
              settings.markers.map((marker) => (
                <div
                  key={marker.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`h-5 w-5 ${getMarkerIcon(marker.type)}`} />
                    <div>
                      <p className="font-medium text-foreground">{marker.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {marker.type.replace("_", " ")} - ({marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)})
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMarker(marker.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
