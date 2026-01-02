"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Shipment {
  id: string
  truck_id: string
  status: string
  trucks: {
    plate_number: string
  }
}

export default function ManualTrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedShipment, setSelectedShipment] = useState<string>("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    const { data, error } = await supabase
      .from("shipments")
      .select(`
        id,
        truck_id,
        status,
        trucks (
          plate_number
        )
      `)
      .in("status", ["loading", "in_transit"])

    if (!error && data) {
      setShipments(data as Shipment[])
    }
  }

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Update shipment status and notes
    const { error: shipmentError } = await supabase
      .from("shipments")
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedShipment)

    // Update truck location
    if (location) {
      const shipment = shipments.find((s) => s.id === selectedShipment)
      if (shipment) {
        await supabase
          .from("trucks")
          .update({
            location,
            status: status === "delivered" ? "available" : "in_transit",
            updated_at: new Date().toISOString(),
          })
          .eq("id", shipment.truck_id)
      }
    }

    if (!shipmentError) {
      alert("Tracking updated successfully!")
      setSelectedShipment("")
      setLocation("")
      setStatus("")
      setNotes("")
      fetchShipments()
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manual Tracking</h1>
        <p className="text-slate-600 mt-1">Update shipment status and location manually</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Tracking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTracking} className="space-y-4">
              <div>
                <Label htmlFor="shipment">Select Shipment</Label>
                <Select value={selectedShipment} onValueChange={setSelectedShipment} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a shipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipments.map((shipment) => (
                      <SelectItem key={shipment.id} value={shipment.id}>
                        {shipment.trucks.plate_number} - {shipment.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Dar es Salaam Port"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loading">Loading</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Tracking"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            {shipments.length > 0 ? (
              <div className="space-y-3">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{shipment.trucks.plate_number}</p>
                      <p className="text-sm text-slate-600">Status: {shipment.status}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedShipment(shipment.id)}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No active shipments</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
