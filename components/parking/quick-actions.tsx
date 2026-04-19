"use client"

import { Car, QrCode, Map, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    {
      icon: Car,
      label: "Find Spot",
      description: "Locate available parking",
    },
    {
      icon: QrCode,
      label: "Scan Entry",
      description: "Scan QR to enter",
    },
    {
      icon: Map,
      label: "Navigate",
      description: "Get directions",
    },
    {
      icon: FileText,
      label: "Reports",
      description: "View analytics",
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-2 py-4 border-border hover:bg-secondary hover:border-primary/50"
            >
              <action.icon className="h-5 w-5 text-primary" />
              <div className="text-center">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
