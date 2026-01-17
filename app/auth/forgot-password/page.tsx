"use client"

import React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // basic client-side email validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({ title: "Invalid email", description: "Please enter a valid email address.",})
        setIsLoading(false)
        return
      }
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/reset-password`
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      
      if (error) {
        toast({ 
          title: "Unable to send reset", 
          description: `${error.message || "Failed to send reset email. Please check your email address or try again later."}` 
        })
      } else {
        setLinkSent(true)
        setCountdown(30)
        toast({ title: "Reset email sent", description: "If that email exists, you'll receive password reset instructions shortly. Check your email inbox and spam folder." })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast({ title: "Error", description: `${message} - Please try again or contact support.` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/reset-password`
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        toast({ title: "Unable to send reset", description: error.message })
      } else {
        setCountdown(30)
        toast({ title: "Reset email sent", description: "Check your email for the reset link." })
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
                  disabled={linkSent}
                />
              </div>

              {linkSent && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-sm text-green-800 font-medium">✓ Reset link sent</p>
                  <p className="text-xs text-green-700 mt-1">
                    Check your email for the password reset instructions.
                  </p>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading || linkSent}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline self-center">
                  Back to login
                </Link>
              </div>

              {linkSent && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-600">
                    Didn't receive the email?
                  </p>
                  {countdown > 0 ? (
                    <p className="text-xs text-slate-500">
                      You can resend in <strong>{countdown} seconds</strong>
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-xs h-auto p-0"
                    >
                      Resend reset link
                    </Button>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
