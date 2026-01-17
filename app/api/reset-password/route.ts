// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/supabaseAdmin"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const supabaseAdmin = createAdminClient()

  const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: "https://ampmcompany-84kzbwoc5-pubg4k12-1267s-projects.vercel.app/reset-password"
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
