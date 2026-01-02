"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Eye, RefreshCw } from "lucide-react"

interface TransportRequest {
  id: string
  requester_name: string
  requester_email: string
  requester_phone: string
  company_name: string | null
  cargo_type: string
  cargo_weight_tons: number
  pickup_location: string
  delivery_location: string
  preferred_date: string | null
  special_requirements: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<TransportRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const url = filterStatus === "all" ? "/api/transport-requests" : `/api/transport-requests?status=${filterStatus}`
      const response = await fetch(url)
      const result = await response.json()
      setRequests(result.data || [])
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [filterStatus])

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/transport-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchRequests()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("[v0] Error updating request:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-slate-100 text-slate-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transport Requests</h1>
          <p className="text-muted-foreground">Manage incoming transport requests</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchRequests}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading requests...</div>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No transport requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{request.requester_name}</CardTitle>
                    <CardDescription>
                      {request.company_name && `${request.company_name} • `}
                      {request.requester_email}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Route</p>
                    <p className="text-sm text-muted-foreground">
                      {request.pickup_location} → {request.delivery_location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Cargo</p>
                    <p className="text-sm text-muted-foreground">
                      {request.cargo_type} • {request.cargo_weight_tons} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Preferred Date</p>
                    <p className="text-sm text-muted-foreground">
                      {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : "No preference"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Requested</p>
                    <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request)
                    setIsDialogOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>View and manage transport request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span> {selectedRequest.requester_name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company:</span> {selectedRequest.company_name || "N/A"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span> {selectedRequest.requester_email}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span> {selectedRequest.requester_phone}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cargo Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span> {selectedRequest.cargo_type}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span> {selectedRequest.cargo_weight_tons} tons
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Route Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pickup:</span> {selectedRequest.pickup_location}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Delivery:</span> {selectedRequest.delivery_location}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preferred Date:</span>{" "}
                    {selectedRequest.preferred_date
                      ? new Date(selectedRequest.preferred_date).toLocaleDateString()
                      : "No preference"}
                  </div>
                </div>
              </div>

              {selectedRequest.special_requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Special Requirements</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.special_requirements}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "approved", "assigned", "in_progress", "completed", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedRequest.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateRequestStatus(selectedRequest.id, status)}
                    >
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
