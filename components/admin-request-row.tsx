"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminRequestRowProps {
  request: any
}

export default function AdminRequestRow({ request }: AdminRequestRowProps) {
  const [status, setStatus] = useState(request.status)
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const markComplete = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("transport_requests")
      .update({ status: "completed" })
      .eq("id", request.id)

    if (!error) setStatus("completed")
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0">
      <div>
        <p className="font-medium text-slate-900">{request.cargo_type}</p>
        <p className="text-sm text-slate-600">
          {request.pickup_location} → {request.delivery_location}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {new Date(request.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/admin/requests/${request.id}`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          View
        </Link>

        {status !== "completed" && (
          <Button
            onClick={markComplete}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark Complete"}
          </Button>
        )}
      </div>
    </div>
  )
}
