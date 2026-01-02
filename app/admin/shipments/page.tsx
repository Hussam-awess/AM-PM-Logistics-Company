import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ShipmentsPage() {
  const supabase = await createClient()

  const { data: shipments } = await supabase
    .from("shipments")
    .select(
      `
      *,
      trucks:truck_id(plate_number, model),
      routes:route_id(name, origin, destination)
    `,
    )
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "loading":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipments</h1>
        <p className="text-muted-foreground">Track and manage active shipments</p>
      </div>

      {shipments && shipments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {shipments.map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg">Shipment {shipment.id.substring(0, 8).toUpperCase()}</CardTitle>
                    <CardDescription>
                      {/* @ts-ignore */}
                      {shipment.trucks?.plate_number} • {shipment.routes?.name || "Custom Route"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Route</p>
                    <p className="text-sm text-muted-foreground">
                      {/* @ts-ignore */}
                      {shipment.routes?.origin || "N/A"} → {shipment.routes?.destination || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Departure</p>
                    <p className="text-sm text-muted-foreground">
                      {shipment.departure_date ? new Date(shipment.departure_date).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Expected Arrival</p>
                    <p className="text-sm text-muted-foreground">
                      {shipment.arrival_date ? new Date(shipment.arrival_date).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                </div>
                {shipment.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{shipment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No shipments yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
