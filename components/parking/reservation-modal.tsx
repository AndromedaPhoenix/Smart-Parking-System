"use client"

import { useState } from "react"
import { Car, Clock, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ParkingSpot } from "@/lib/parking-types"

interface ReservationModalProps {
  spot: ParkingSpot | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReserve: (spotId: string, duration: string, vehicleId: string) => void
}

export function ReservationModal({
  spot,
  open,
  onOpenChange,
  onReserve,
}: ReservationModalProps) {
  const [vehicleId, setVehicleId] = useState("")
  const [duration, setDuration] = useState("1")

  const handleReserve = () => {
    if (spot && vehicleId) {
      onReserve(spot.id, duration, vehicleId)
      setVehicleId("")
      setDuration("1")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Reserve Spot {spot?.row}{spot?.number}
          </DialogTitle>
          <DialogDescription>
            Reserve this parking spot for your vehicle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle ID / License Plate</Label>
            <Input
              id="vehicle"
              placeholder="e.g., ABC-1234"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours (Full day)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-secondary p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </span>
              <span className="text-foreground">{duration} hour(s)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Valid until
              </span>
              <span className="text-foreground">
                {new Date(Date.now() + parseInt(duration) * 3600000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-border"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleReserve}
              disabled={!vehicleId}
            >
              Reserve Spot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
