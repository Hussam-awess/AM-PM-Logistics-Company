import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "driver":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and roles</p>
      </div>

      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{profile.full_name || "No Name"}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <Badge className={getRoleBadgeColor(profile.role)}>{profile.role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  {profile.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span> {profile.phone}
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Joined:</span>{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
