"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      // Get the session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Get user profile to check role
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, is_management")
          .eq("id", session.user.id)
          .single()

        if (profile?.is_admin) {
          router.push("/admin")
        } else if (profile?.is_management) {
          router.push("/management")
        } else {
          router.push("/customer")
        }
      } else {
        router.push("/auth/login")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
        <p className="text-muted-foreground">Please wait while we confirm your account.</p>
      </div>
    </div>
  )
}
