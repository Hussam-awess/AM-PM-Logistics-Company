import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ManagementSidebar from "@/components/management-sidebar"

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_management").eq("id", user.id).single()

  if (!profile || !profile.is_management) {
    redirect("/customer")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <ManagementSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
