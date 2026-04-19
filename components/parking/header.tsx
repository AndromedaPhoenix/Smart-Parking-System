"use client"

import { Car, Bell, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Car className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">SmartPark</h1>
          <p className="text-xs text-muted-foreground">Intelligent Parking Management</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search spots, vehicles..."
            className="w-full pl-9 bg-secondary border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          JD
        </div>
      </div>
    </header>
  )
}
