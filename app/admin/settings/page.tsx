"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft, Map, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { ParkingMap } from "@/components/parking/parking-map"
import { Toaster } from "@/components/ui/sonner"

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading, admin, mapSettings, updateMapSettings, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Admin Settings</h1>
            <p className="text-xs text-muted-foreground">Configure your parking system</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{admin.name}</p>
            <p className="text-xs text-muted-foreground">{admin.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              Map Settings
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <ParkingMap settings={mapSettings} onSettingsChange={updateMapSettings} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Admin Profile
                </CardTitle>
                <CardDescription>
                  View and manage your admin account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={admin.name}
                      disabled
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={admin.email}
                      disabled
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {admin.role.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <Input
                      value={admin.createdAt.toLocaleDateString()}
                      disabled
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure general system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>System Name</Label>
                    <Input
                      value="SmartPark"
                      disabled
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input
                      value="1.0.0"
                      disabled
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">
                    Additional settings and configurations will be available in future updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  )
}
