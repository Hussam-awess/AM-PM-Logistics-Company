import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch jobs analytics
  const [requestedResult, completedResult, totalResult] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("jobs").select("id", { count: "exact", head: true }),
  ])

  const requested = requestedResult.count || 0
  const completed = completedResult.count || 0
  const total = totalResult.count || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Admin analytics for completed and requested jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Jobs Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{requested}</div>
            <p className="text-xs text-muted-foreground mt-1">Requested by customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Marked completed by management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
