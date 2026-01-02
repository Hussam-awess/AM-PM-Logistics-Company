import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CustomerSidebar from "@/components/customer-sidebar"

export default async function CustomerLayout({
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

  const { data: profile } = await supabase.from("profiles").select("is_admin, is_management").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  if (profile.is_admin) {
    redirect("/admin")
  }
  if (profile.is_management) {
    redirect("/management")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CustomerSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
