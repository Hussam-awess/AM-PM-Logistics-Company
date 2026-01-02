"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"

interface Meeting {
  id: string
  title: string
  description: string
  scheduled_time: string
  location: string
  meeting_type: string
  status: string
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_time: "",
    location: "",
    meeting_type: "team",
  })
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    const { data, error } = await supabase.from("meetings").select("*").order("scheduled_time", { ascending: true })

    if (!error && data) {
      setMeetings(data)
    }
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("meetings").insert({
      ...formData,
      created_by: user.id,
    })

    if (!error) {
      setOpen(false)
      setFormData({
        title: "",
        description: "",
        scheduled_time: "",
        location: "",
        meeting_type: "team",
      })
      fetchMeetings()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-600 mt-1">Schedule and manage team meetings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Schedule Meeting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="scheduled_time">Date & Time</Label>
                <Input
                  id="scheduled_time"
                  type="datetime-local"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Conference Room A, Zoom"
                />
              </div>
              <div>
                <Label htmlFor="meeting_type">Meeting Type</Label>
                <Select
                  value={formData.meeting_type}
                  onValueChange={(value) => setFormData({ ...formData, meeting_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team Meeting</SelectItem>
                    <SelectItem value="management">Management Only</SelectItem>
                    <SelectItem value="all_hands">All Hands</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{meeting.title}</CardTitle>
                  {meeting.description && <p className="text-sm text-slate-600 mt-1">{meeting.description}</p>}
                </div>
                <Badge variant={meeting.status === "scheduled" ? "default" : "secondary"}>{meeting.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(meeting.scheduled_time).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  {new Date(meeting.scheduled_time).toLocaleTimeString()}
                </div>
                {meeting.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {meeting.location}
                  </div>
                )}
                <Badge variant="outline" className="w-fit mt-2">
                  {meeting.meeting_type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meetings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No meetings scheduled</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
