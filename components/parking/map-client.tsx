"use client"

import { forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import type { ParkingMarker } from "@/lib/auth-types"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default marker icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

const getMarkerColor = (type: ParkingMarker["type"]) => {
  switch (type) {
    case "entrance":
      return "#22c55e" // green
    case "exit":
      return "#ef4444" // red
    case "parking_area":
      return "#f59e0b" // amber
    case "accessible":
      return "#3b82f6" // blue
    default:
      return "#6b7280" // gray
  }
}

interface MapEventsProps {
  onCenterChange: (center: { lat: number; lng: number }) => void
  onZoomChange: (zoom: number) => void
}

function MapEvents({ onCenterChange, onZoomChange }: MapEventsProps) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      onCenterChange({ lat: center.lat, lng: center.lng })
    },
    zoomend: () => {
      onZoomChange(map.getZoom())
    },
  })
  return null
}

interface MapCenterUpdaterProps {
  center: { lat: number; lng: number }
  zoom: number
}

function MapCenterUpdater({ center, zoom }: MapCenterUpdaterProps) {
  const map = useMap()
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center.lat, center.lng, zoom, map])
  
  return null
}

interface DraggableMarkerProps {
  marker: ParkingMarker
  onDrag: (id: string, position: { lat: number; lng: number }) => void
}

function DraggableMarker({ marker, onDrag }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker>(null)

  const eventHandlers = {
    dragend() {
      const m = markerRef.current
      if (m != null) {
        const pos = m.getLatLng()
        onDrag(marker.id, { lat: pos.lat, lng: pos.lng })
      }
    },
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[marker.position.lat, marker.position.lng]}
      ref={markerRef}
      icon={createCustomIcon(getMarkerColor(marker.type))}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{marker.label}</p>
          <p className="text-muted-foreground capitalize">{marker.type.replace("_", " ")}</p>
        </div>
      </Popup>
    </Marker>
  )
}

interface MapClientProps {
  center: { lat: number; lng: number }
  zoom: number
  markers: ParkingMarker[]
  onMarkerDrag: (id: string, position: { lat: number; lng: number }) => void
  onCenterChange: (center: { lat: number; lng: number }) => void
  onZoomChange: (zoom: number) => void
}

export const MapClient = forwardRef<
  { getCenter: () => { lat: number; lng: number }; getZoom: () => number },
  MapClientProps
>(function MapClient({ center, zoom, markers, onMarkerDrag, onCenterChange, onZoomChange }, ref) {
  const mapRef = useRef<L.Map | null>(null)

  useImperativeHandle(ref, () => ({
    getCenter: () => {
      if (mapRef.current) {
        const c = mapRef.current.getCenter()
        return { lat: c.lat, lng: c.lng }
      }
      return center
    },
    getZoom: () => {
      if (mapRef.current) {
        return mapRef.current.getZoom()
      }
      return zoom
    },
  }))

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="h-full w-full"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onCenterChange={onCenterChange} onZoomChange={onZoomChange} />
      {markers.map((marker) => (
        <DraggableMarker
          key={marker.id}
          marker={marker}
          onDrag={onMarkerDrag}
        />
      ))}
    </MapContainer>
  )
})
