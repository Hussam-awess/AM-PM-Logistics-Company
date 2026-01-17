"use client"
import React, { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/browser"

interface Props {
  userId: string
}

export default function NotificationBell({ userId }: Props) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    async function fetchNotifications() {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      setNotifications(data || [])
    }
    fetchNotifications()
  }, [supabase, userId])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-md overflow-y-auto max-h-64 z-50">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="p-2 border-b last:border-0 hover:bg-gray-100">
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No notifications</p>
          )}
          
        </div>
      )}
    </div>
  )
}
