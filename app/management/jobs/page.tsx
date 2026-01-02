"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { generateWhatsAppUrl } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  customer_name: string
  phone: string
  details: string
  status: string
  created_at: string
}

export default function JobAssignmentsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("jobs").select("id, customer_name, phone, details, status, created_at").order("created_at", { ascending: false })
    if (error) {
      toast({ title: "Error fetching jobs", description: error.message })
    } else if (data) {
      setJobs(data as Job[])
    }
    setLoading(false)
  }

  const markCompleted = async (id: string) => {
    // Only set status = 'completed' per rules
    const { error } = await supabase.from("jobs").update({ status: "completed" }).eq("id", id)
    if (error) {
      toast({ title: "Unable to mark completed", description: error.message })
      return
    }
    // Optimistic UI: update locally
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "completed" } : j)))
    toast({ title: "Job marked completed" })
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customer Jobs</h1>
        <p className="text-slate-600 mt-1">Incoming job requests from customers</p>
      </div>

      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{job.customer_name}</CardTitle>
                    <CardDescription className="text-sm">{new Date(job.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant={job.status === "completed" ? "default" : "outline"}>{job.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Phone</p>
                    <p className="text-slate-900">{job.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Details</p>
                    <div className="text-slate-900">
                      {(() => {
                        try {
                          const d = JSON.parse(job.details || "null")
                          if (d && typeof d === "object") {
                            // Render known fields first, then any additional keys
                            const known = [
                              "requester_email",
                              "company_name",
                              "container_number",
                              "cargo_type",
                              "cargo_weight_tons",
                              "pickup_location",
                              "delivery_location",
                              "preferred_date",
                              "special_requirements",
                            ]

                            const entries = Object.entries(d)

                            return (
                              <div className="space-y-1 text-sm">
                                {known.map((k) => {
                                  if (k in d && d[k] != null) {
                                    const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                                    return (
                                      <div key={k}>
                                        <strong>{label}:</strong> {String(d[k])}
                                      </div>
                                    )
                                  }
                                  return null
                                })}

                                {/* Render any additional keys */}
                                {entries
                                  .filter(([key]) => !known.includes(key))
                                  .map(([key, value]) => (
                                    <div key={key}>
                                      <strong>{key.replace(/_/g, " ")}: </strong>
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </div>
                                  ))}
                              </div>
                            )
                          }
                        } catch (e) {
                          return null
                        }
                        return <pre className="whitespace-pre-wrap text-sm">{job.details}</pre>
                      })()}
                    </div>
                  </div>


                  <div className="flex gap-2">
                    <a href={generateWhatsAppUrl(job.phone, job.customer_name, job.id)} target="_blank" rel="noreferrer">
                      <Button variant="outline">Contact via WhatsApp</Button>
                    </a>

                    <Button disabled={job.status === "completed"} onClick={() => markCompleted(job.id)} className="ml-auto">
                      Job Done
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No job requests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
