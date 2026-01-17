"use client"
import React, { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Props {
  userId: string
}

export default function AdminNotifications({ userId }: Props) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const supabase = createBrowserClient()

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
    setNotifications(data || [])
  }

  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel("admin-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transport_requests" },
        () => fetchNotifications()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="relative">
      <Bell
        className="h-6 w-6 cursor-pointer text-gray-600"
        onClick={() => setOpen(!open)}
      />
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {notifications.length}
        </span>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="p-2 text-sm font-medium border-b">Recent Requests</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-gray-500 text-center">No new requests</div>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="p-2 border-b hover:bg-gray-100">
                <p className="font-medium text-gray-800">{n.cargo_type}</p>
                <p className="text-xs text-gray-500">
                  {n.pickup_location} → {n.delivery_location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
