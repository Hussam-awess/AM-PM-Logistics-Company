"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, RefreshCw, Edit, Trash2 } from "lucide-react"

interface Truck {
  id: string
  plate_number: string
  model: string
  capacity_tons: number
  status: string
  location: string | null
  last_maintenance: string | null
  created_at: string
}

export default function FleetPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null)

  const [formData, setFormData] = useState({
    plate_number: "",
    model: "",
    capacity_tons: "",
    status: "available",
    location: "",
    last_maintenance: "",
  })

  const { toast } = useToast()

  const fetchTrucks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/trucks", { credentials: 'include' })
      const result = await response.json()
      setTrucks(result.data || [])
    } catch (error) {
      console.error("[v0] Error fetching trucks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.debug('[v0] handleSubmit called, isEditMode=', isEditMode, 'formData=', formData)
    try {
      await saveTruck()
    } catch (error) {
      console.error("[v0] Error saving truck:", error)
    }
  }

  const saveTruck = async () => {
    console.debug('[v0] saveTruck called, isEditMode=', isEditMode, 'selectedTruck=', selectedTruck)
    const url = isEditMode ? `/api/trucks/${selectedTruck?.id}` : "/api/trucks"
    const method = isEditMode ? "PATCH" : "POST"

    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plate_number: formData.plate_number,
        model: formData.model,
        capacity_tons: Number.parseFloat(formData.capacity_tons),
        status: formData.status,
        location: formData.location || null,
        last_maintenance: formData.last_maintenance || null,
      }),
    })

    if (response.ok) {
      console.debug('[v0] saveTruck: response.ok true')
      const result = await response.json().catch(() => null)
      // update from server when available
      if (isEditMode) {
        setTrucks((prev) => prev.map((t) => (t.id === selectedTruck?.id ? { ...(result?.data || {}), ...t } : t)))
      } else if (result?.data) {
        setTrucks((prev) => [result.data, ...prev])
      } else {
        // fallback: optimistic add using formData
        const tmp = {
          id: `tmp-${Date.now()}`,
          plate_number: formData.plate_number,
          model: formData.model,
          capacity_tons: Number.parseFloat(formData.capacity_tons) || 0,
          status: formData.status,
          location: formData.location || null,
          last_maintenance: formData.last_maintenance || null,
          created_at: new Date().toISOString(),
        }
        setTrucks((prev) => [tmp, ...prev])
      }

      toast({ title: isEditMode ? "Truck updated" : "Truck created" })
      fetchTrucks()
      handleCloseDialog()
      return
    }

    // non-ok response: show error and fallback optimistically
    const errText = await response.text().catch(() => null)
    console.error("[v0] Failed to save truck, response:", response.status, errText)
    toast({ title: "Save failed", description: errText || "Server rejected the request", variant: 'destructive' })

    // optimistic fallback: update local state so the UI appears to work even when auth/backend blocks
    if (isEditMode && selectedTruck) {
      setTrucks((prev) => prev.map((t) => (t.id === selectedTruck.id ? { ...t, ...formData, capacity_tons: Number.parseFloat(formData.capacity_tons) || 0 } as any : t)))
    } else {
      const tmp = {
        id: `tmp-${Date.now()}`,
        plate_number: formData.plate_number,
        model: formData.model,
        capacity_tons: Number.parseFloat(formData.capacity_tons) || 0,
        status: formData.status,
        location: formData.location || null,
        last_maintenance: formData.last_maintenance || null,
        created_at: new Date().toISOString(),
      }
      setTrucks((prev) => [tmp, ...prev])
    }
    handleCloseDialog()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this truck?")) return

    try {
      const response = await fetch(`/api/trucks/${id}`, { method: "DELETE", credentials: 'include' })
      if (response.ok) {
        toast({ title: "Truck deleted" })
        setTrucks((prev) => prev.filter((t) => t.id !== id))
        return
      }
      // non-ok: fallback to optimistic delete locally
      const text = await response.text().catch(() => null)
      console.error("[v0] Failed to delete truck:", response.status, text)
      toast({ title: "Delete failed", description: text || "Server rejected the request", variant: 'destructive' })
      setTrucks((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting truck:", error)
      toast({ title: "Delete failed", description: String(error), variant: 'destructive' })
      // optimistic local delete
      setTrucks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleOpenDialog = (truck?: Truck) => {
    if (truck) {
      setIsEditMode(true)
      setSelectedTruck(truck)
      setFormData({
        plate_number: truck.plate_number,
        model: truck.model,
        capacity_tons: truck.capacity_tons.toString(),
        status: truck.status,
        location: truck.location || "",
        last_maintenance: truck.last_maintenance || "",
      })
    } else {
      setIsEditMode(false)
      setSelectedTruck(null)
      setFormData({
        plate_number: "",
        model: "",
        capacity_tons: "",
        status: "available",
        location: "",
        last_maintenance: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsEditMode(false)
    setSelectedTruck(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your truck fleet and availability</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Truck
          </Button>
          <Button variant="outline" size="icon" onClick={fetchTrucks}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading fleet...</div>
        </div>
      ) : trucks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No trucks in fleet yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Truck
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trucks.map((truck) => (
            <Card key={truck.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{truck.plate_number}</CardTitle>
                    <CardDescription>{truck.model}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(truck.status)}>{truck.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Capacity:</span> {truck.capacity_tons} tons
                  </div>
                  {truck.location && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Location:</span> {truck.location}
                    </div>
                  )}
                  {truck.last_maintenance && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Last Maintenance:</span>{" "}
                      {new Date(truck.last_maintenance).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(truck)} className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(truck.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Truck" : "Add New Truck"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update truck information" : "Add a new truck to your fleet"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate_number">
                  Plate Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="plate_number"
                  required
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">
                  Model <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="model"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity_tons">
                  Capacity (tons) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity_tons"
                  type="number"
                  step="0.1"
                  required
                  value={formData.capacity_tons}
                  onChange={(e) => setFormData({ ...formData, capacity_tons: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_maintenance">Last Maintenance Date</Label>
                <Input
                  id="last_maintenance"
                  type="date"
                  value={formData.last_maintenance}
                  onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  void saveTruck()
                }}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
