import { createBrowserClient } from "@/lib/supabase/client"

export async function markNotificationRead(notificationId: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)

  if (error) console.error("Failed to mark as read:", error)
}

export async function getNotifications(userId: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
