// lib/supabase/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js"

// This uses your SERVICE ROLE key, must be server-side only
export const createAdminClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables")
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
