"use client"

import { LogIn, LogOut, Calendar, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RecentActivity } from "@/lib/parking-types"
import { cn } from "@/lib/utils"

interface ActivityFeedProps {
  activities: RecentActivity[]
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const activityConfig = {
    entry: {
      icon: LogIn,
      color: "text-available",
      bgColor: "bg-available/10",
    },
    exit: {
      icon: LogOut,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    reservation: {
      icon: Calendar,
      color: "text-reserved",
      bgColor: "bg-reserved/10",
    },
    cancellation: {
      icon: XCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  }

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-4 pb-4">
            {activities.map((activity) => {
              const config = activityConfig[activity.type]
              const Icon = config.icon

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
