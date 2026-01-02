import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TeamPage() {
  const supabase = await createClient()

  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_management", true)
    .order("full_name", { ascending: true })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Management Team</h1>
        <p className="text-slate-600 mt-1">View your team members</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle className="text-lg">{member.full_name || "No Name"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-slate-600">Email</p>
                    <p className="font-medium">{member.email}</p>
                  </div>
                  {member.phone && (
                    <div>
                      <p className="text-slate-600">Phone</p>
                      <p className="font-medium">{member.phone}</p>
                    </div>
                  )}
                  <Badge variant="secondary">Management</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <p className="text-slate-500">No team members found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
