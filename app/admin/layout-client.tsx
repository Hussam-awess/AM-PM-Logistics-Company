"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import NotificationBell from "@/components/notification-bell"
import { createClient } from "@/lib/supabase/browser"

interface Props {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch user on client-side
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        router.push("/auth/login")
      } else {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (!userId) return null

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-y-auto md:ml-64">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 shadow sticky top-0 z-40">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <NotificationBell userId={userId} />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
