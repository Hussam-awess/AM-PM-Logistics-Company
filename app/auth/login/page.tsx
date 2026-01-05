"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Login attempt started for email:", email)

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Sign in response:", { signInData, signInError })

      if (signInError) {
        console.log("[v0] Sign in error:", signInError)
        throw signInError
      }

      console.log("[v0] User signed in successfully:", signInData.user.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, is_management")
        .eq("id", signInData.user.id)
        .maybeSingle()

      console.log("[v0] Profile query response:", { profile, profileError })

      if (profileError) {
        console.log("[v0] Profile error:", profileError)
        throw profileError
      }

      if (!profile) {
        console.log("[v0] No profile found, redirecting to customer dashboard")
        router.push("/customer")
        router.refresh()
        return
      }

      console.log("[v0] Profile found:", profile)

      if (profile.is_admin) {
        console.log("[v0] Redirecting to admin dashboard")
        router.push("/admin")
      } else if (profile.is_management) {
        console.log("[v0] Redirecting to management dashboard")
        router.push("/management")
      } else {
        console.log("[v0] Redirecting to customer dashboard")
        router.push("/customer")
      }

      router.refresh()
    } catch (error: unknown) {
      console.log("[v0] Login error caught:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">AM-PM Company Ltd</h1>
            <p className="text-sm text-slate-600">Logistics & Transportation</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <div>
                      Don't have an account?{" "}
                      <Link href="/auth/sign-up" className="text-primary hover:underline">
                        <p>Sign up</p>
                      </Link>
                    </div>
                    <div>
                      <Link href="/auth/forgot-password" className="text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
