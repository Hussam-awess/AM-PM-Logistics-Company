/*
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CustomerRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

  const { data: requests } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("requester_email", profile?.email || "")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Transport Requests</h1>
          <p className="text-slate-600 mt-1">View and track all your transport requests</p>
        </div>
        <Button asChild>
          <Link href="/request">New Request</Link>
        </Button>
      </div>

      {requests && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{request.cargo_type}</CardTitle>
                    <CardDescription>
                      Container: {request.container_number || "N/A"} • {request.cargo_weight_tons} tons
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      request.status === "completed"
                        ? "default"
                        : request.status === "in_progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pickup Location</p>
                    <p className="text-slate-900">{request.pickup_location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Delivery Location</p>
                    <p className="text-slate-900">{request.delivery_location}</p>
                  </div>
                  {request.preferred_date && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">Preferred Date</p>
                      <p className="text-slate-900">{new Date(request.preferred_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-600">Requested On</p>
                    <p className="text-slate-900">{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  {request.special_requirements && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-slate-600">Special Requirements</p>
                      <p className="text-slate-900">{request.special_requirements}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No transport requests found</p>
            <Button asChild className="mt-4">
              <Link href="/request">Create Your First Request</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
*/

// Customer portal requests page is temporarily disabled
// Uncomment the code above to enable the customer requests page
export default function CustomerRequestsDisabled() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Customer Requests</h1>
        <p className="text-slate-600">The customer requests page is currently being updated.</p>
        <p className="text-sm text-slate-500 mt-2">Please check back soon or contact support.</p>
      </div>
    </div>
  )
}
