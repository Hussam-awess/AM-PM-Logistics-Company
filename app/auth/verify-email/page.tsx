"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resendIdentityConfirmationEmail(email)
      
      if (error) {
        toast({ title: "Unable to resend", description: error.message })
      } else {
        setCountdown(30)
        toast({ title: "Confirmation email sent", description: "Check your email for the verification link." })
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
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>Confirmation link sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <p className="text-sm font-medium">
                  We sent a confirmation link to: <span className="text-primary">{email}</span>
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Please check your email inbox (and spam folder) for a confirmation link from AM-PM Company Ltd. Click
                the link to activate your account and then you can log in.
              </p>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> If you don&apos;t receive the email within a few minutes, the account may have
                  been created successfully. Try logging in directly.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/sign-up">Create Different Account</Link>
                </Button>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <p className="text-xs text-slate-600 text-center">
                  Didn't receive the email?
                </p>
                {countdown > 0 ? (
                  <p className="text-xs text-slate-500 text-center">
                    You can resend in <strong>{countdown} seconds</strong>
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendEmail}
                    disabled={isLoading || !email}
                    className="w-full"
                  >
                    {isLoading ? "Sending..." : "Resend confirmation link"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
