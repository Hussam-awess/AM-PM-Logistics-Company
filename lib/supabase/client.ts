import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase URL or ANON KEY missing in createBrowserClient')
  }

  return createSupabaseBrowserClient(supabaseUrl || "", supabaseAnonKey || "")
}

// Legacy export for backwards compatibility
export function createClient() {
  return createBrowserClient()
}
