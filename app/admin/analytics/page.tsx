"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [growth, setGrowth] = useState({ requests: 0, revenue: 0 })
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    // Fetch all transport requests
    const { data: requests } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: true })

    if (requests) {
      // Calculate monthly data
      const monthlyStats = requests.reduce((acc: any, req) => {
        const month = new Date(req.created_at).toLocaleDateString("en-US", { month: "short" })
        if (!acc[month]) {
          acc[month] = { month, requests: 0, completed: 0 }
        }
        acc[month].requests++
        if (req.status === "completed") {
          acc[month].completed++
        }
        return acc
      }, {})

      setMonthlyData(Object.values(monthlyStats))

      // Calculate status distribution
      const statusStats = requests.reduce((acc: any, req) => {
        if (!acc[req.status]) {
          acc[req.status] = { status: req.status, count: 0 }
        }
        acc[req.status].count++
        return acc
      }, {})

      setStatusData(Object.values(statusStats))

      // Calculate growth (comparing last 30 days to previous 30 days)
      const now = new Date()
      const last30Days = requests.filter(
        (r) => new Date(r.created_at) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      )
      const previous30Days = requests.filter(
        (r) =>
          new Date(r.created_at) > new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) &&
          new Date(r.created_at) <= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      )

      const requestGrowth =
        previous30Days.length > 0 ? ((last30Days.length - previous30Days.length) / previous30Days.length) * 100 : 0

      setGrowth({
        requests: Math.round(requestGrowth),
        revenue: Math.round(requestGrowth * 0.8), // Simulated revenue growth
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Growth</h1>
        <p className="text-slate-600 mt-1">Monitor company performance and trends</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Request Growth</CardTitle>
            {growth.requests >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${growth.requests >= 0 ? "text-green-600" : "text-red-600"}`}>
              {growth.requests >= 0 ? "+" : ""}
              {growth.requests}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Last 30 days vs previous</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenue Growth</CardTitle>
            {growth.revenue >= 0 ? (
              <DollarSign className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${growth.revenue >= 0 ? "text-green-600" : "text-red-600"}`}>
              {growth.revenue >= 0 ? "+" : ""}
              {growth.revenue}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Estimated from requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Requests</CardTitle>
            <Package className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {monthlyData.reduce((sum, m) => sum + m.requests, 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {monthlyData.length > 0
                ? Math.round(
                    (monthlyData.reduce((sum, m) => sum + m.completed, 0) /
                      monthlyData.reduce((sum, m) => sum + m.requests, 0)) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-slate-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Requests Trend</CardTitle>
            <CardDescription>Request volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: {
                  label: "Total Requests",
                  color: "hsl(var(--chart-1))",
                },
                completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="var(--color-requests)" name="Total Requests" />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
