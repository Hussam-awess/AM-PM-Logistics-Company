"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2 } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  full_name: string
  phone: string
  is_admin: boolean
  is_management: boolean
  created_at: string
}

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or("is_admin.eq.true,is_management.eq.true")
      .order("full_name", { ascending: true })

    if (!error && data) {
      setTeam(data)
    }
  }

  const handleUpdateRoles = async (memberId: string, isAdmin: boolean, isManagement: boolean) => {
    setLoading(true)
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: isAdmin, is_management: isManagement })
      .eq("id", memberId)

    if (!error) {
      fetchTeam()
      setSelectedMember(null)
    }
    setLoading(false)
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this team member's admin/management access?")) return

    setLoading(true)
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: false, is_management: false })
      .eq("id", memberId)

    if (!error) {
      fetchTeam()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-1">Manage admin and management team members</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{member.full_name || "No Name"}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedMember(member)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Team Member</DialogTitle>
                      <DialogDescription>Update roles for {member.full_name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is-admin">Admin Access</Label>
                        <Switch
                          id="is-admin"
                          checked={selectedMember?.is_admin || false}
                          onCheckedChange={(checked) =>
                            setSelectedMember(selectedMember ? { ...selectedMember, is_admin: checked } : null)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is-management">Management Access</Label>
                        <Switch
                          id="is-management"
                          checked={selectedMember?.is_management || false}
                          onCheckedChange={(checked) =>
                            setSelectedMember(selectedMember ? { ...selectedMember, is_management: checked } : null)
                          }
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          selectedMember &&
                          handleUpdateRoles(selectedMember.id, selectedMember.is_admin, selectedMember.is_management)
                        }
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {member.phone && <p className="text-sm text-slate-600">Phone: {member.phone}</p>}
                <div className="flex gap-2 flex-wrap">
                  {member.is_admin && <Badge>Admin</Badge>}
                  {member.is_management && <Badge variant="secondary">Management</Badge>}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Access
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {team.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No team members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
