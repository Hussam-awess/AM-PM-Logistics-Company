"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TransportRequest {
  id: string
  requester_name: string
  requester_email: string
  cargo_type: string
  pickup_location: string
  delivery_location: string
}

interface Communication {
  id: string
  message: string
  sender_type: string
  created_at: string
  profiles: {
    full_name: string
  }
}

export default function CommunicationsPage() {
  const [requests, setRequests] = useState<TransportRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<string>("")
  const [message, setMessage] = useState("")
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (selectedRequest) {
      fetchCommunications(selectedRequest)
    }
  }, [selectedRequest])

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setRequests(data)
    }
  }

  const fetchCommunications = async (requestId: string) => {
    const { data, error } = await supabase
      .from("communications")
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq("request_id", requestId)
      .order("created_at", { ascending: true })

    if (!error && data) {
      setCommunications(data as Communication[])
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("communications").insert({
      request_id: selectedRequest,
      sender_id: user.id,
      sender_type: "management",
      message,
    })

    if (!error) {
      setMessage("")
      fetchCommunications(selectedRequest)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customer Communications</h1>
        <p className="text-slate-600 mt-1">Follow up and communicate with customers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.map((request) => (
                <Button
                  key={request.id}
                  variant={selectedRequest === request.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setSelectedRequest(request.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{request.requester_name}</span>
                    <span className="text-xs opacity-75">{request.cargo_type}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Communication Thread</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-4">
                <div className="h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-slate-50">
                  {communications.map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-3 rounded-lg ${
                        comm.sender_type === "management"
                          ? "bg-primary text-primary-foreground ml-8"
                          : "bg-white border mr-8"
                      }`}
                    >
                      <p className="text-sm">{comm.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {comm.profiles.full_name} • {new Date(comm.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="space-y-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                    rows={3}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">Select a transport request to view communications</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
