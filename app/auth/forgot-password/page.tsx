"use client"

import React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)
    try {
      // basic client-side email validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({ title: "Invalid email", description: "Please enter a valid email address.",})
        setIsLoading(false)
        return
      }
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/login`
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        toast({ title: "Unable to send reset", description: error.message })
      } else {
        toast({ title: "Reset email sent", description: "If that email exists, you'll receive password reset instructions shortly." })
        setEmail("")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast({ title: "Error", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Enter your email to receive reset instructions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {status && <div className="text-sm text-center text-slate-700">{status}</div>}

              <div className="flex gap-2 items-center">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline self-center">
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
