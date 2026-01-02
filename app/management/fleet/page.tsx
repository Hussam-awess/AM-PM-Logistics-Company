import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function FleetStatusPage() {
  const supabase = await createClient()

  const { data: trucks } = await supabase.from("trucks").select("*").order("status", { ascending: true })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Fleet Status</h1>
        <p className="text-slate-600 mt-1">Monitor all company vehicles in real-time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trucks && trucks.length > 0 ? (
          trucks.map((truck) => (
            <Card key={truck.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{truck.plate_number}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{truck.model}</p>
                  </div>
                  <Badge
                    variant={
                      truck.status === "available" ? "default" : truck.status === "in_transit" ? "secondary" : "outline"
                    }
                  >
                    {truck.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Capacity:</span>
                    <span className="font-medium">{truck.capacity_tons} tons</span>
                  </div>
                  {truck.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{truck.location}</span>
                    </div>
                  )}
                  {truck.last_maintenance && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Service:</span>
                      <span className="font-medium">{new Date(truck.last_maintenance).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <p className="text-slate-500">No trucks found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
