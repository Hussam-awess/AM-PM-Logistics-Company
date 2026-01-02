import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ManagementDashboard() {
  const supabase = await createClient()

  // Fetch job stats
  const [requestedResult, completedResult] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "completed"),
  ])

  const requested = requestedResult.count || 0
  const completed = completedResult.count || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Management Dashboard</h1>
        <p className="text-slate-600 mt-1">Track customer job requests and mark them completed</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">Jobs Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{requested}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Manage incoming customer jobs manually via WhatsApp.</p>
            <div className="mt-4">
              <Link href="/management/jobs" className="text-primary underline">
                Open Jobs list
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
