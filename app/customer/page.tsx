/*
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get customer's transport requests
  const { data: requests } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("requester_email", profile?.email || "")
    .order("created_at", { ascending: false })

  const pendingCount = requests?.filter((r) => r.status === "pending").length || 0
  const inProgressCount = requests?.filter((r) => r.status === "in_progress").length || 0
  const completedCount = requests?.filter((r) => r.status === "completed").length || 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.full_name || "Customer"}!</h1>
          <p className="text-slate-600 mt-1">Track your shipments and manage your transport requests</p>
        </div>
        <Button asChild>
          <Link href="/request">New Request</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Requests</CardTitle>
            <Package className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{requests?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Progress</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Your latest transport requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">{request.cargo_type}</p>
                    <p className="text-sm text-slate-600">
                      {request.pickup_location} → {request.delivery_location}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : request.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : request.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No transport requests yet</p>
              <Button asChild className="mt-4">
                <Link href="/request">Create Your First Request</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
*/
