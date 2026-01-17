"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function RequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    companyName: "",
    containerNumber: "",
    cargoType: "",
    cargoWeight: "",
    pickupLocation: "",
    deliveryLocation: "",
    preferredDate: "",
    specialRequirements: "",
    requestType: "price_quote",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setIsAuthenticated(true)
        setUserEmail(user.email || "")
        setFormData((prev) => ({ ...prev, requesterEmail: user.email || "" }))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const COMPANY_WHATSAPP = "255788086288" 

const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault()
  setIsSubmitting(true)
  setError(null)

  try {
    // Determine status and message based on request type
    const isQuoteRequest = formData.requestType === "price_quote"
    const requestStatus = isQuoteRequest ? "quote_requested" : "pending"
    
    const messageHeader = isQuoteRequest 
      ? "PRICE QUOTATION REQUEST\n(This is not a confirmed job)"
      : "TRANSPORT JOB REQUEST\n(Confirmed booking)"

    const message = `
${messageHeader}

Name: ${formData.requesterName}
Phone: ${formData.requesterPhone}
Pickup: ${formData.pickupLocation}
Delivery: ${formData.deliveryLocation}
Container: ${formData.containerNumber || "N/A"}
Cargo type: ${formData.cargoType}
Weight: ${formData.cargoWeight} tons
${formData.companyName ? `Company: ${formData.companyName}` : ""}
${formData.preferredDate ? `Preferred Date: ${formData.preferredDate}` : ""}
${formData.specialRequirements ? `Notes: ${formData.specialRequirements}` : ""}
    `

    const whatsappURL = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappURL, "_blank")
    await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "Pubg4k12@gmail.com",
    subject: `🚚 New ${isQuoteRequest ? "Quote" : "Transport"} Request`,
    html: `
      <h3>${isQuoteRequest ? "Price Quotation Request" : "Transport Job Request"}</h3>
      <p><b>Name:</b> ${formData.requesterName}</p>
      <p><b>Phone:</b> ${formData.requesterPhone}</p>
      <p><b>Pickup:</b> ${formData.pickupLocation}</p>
      <p><b>Delivery:</b> ${formData.deliveryLocation}</p>
      <p><b>Type:</b> ${isQuoteRequest ? "Price Quote" : "Transport Job"}</p>
    `,
  }),
})
    setIsSuccess(true) // show success message immediately
  } catch (err) {
    setError("Failed to submit request. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl">Login Required</CardTitle>
                <CardDescription className="text-base mt-2">
                  You need an AM-PM account to request transport services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  To submit a transport request, please log in to your AM-PM Company Ltd account. If you don't have an
                  account yet, you can create one.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => router.push("/auth/login")}>Login to Your Account</Button>
                  <Button onClick={() => router.push("/auth/sign-up")} variant="outline">
                    Create New Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  if (isSuccess) {
    const isQuoteRequest = formData.requestType === "price_quote"
    
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                   <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>    
                </div>
                <CardTitle className="text-3xl">Request Submitted Successfully!</CardTitle>
                <CardDescription className="text-base mt-2">Thank you for choosing AM-PM Company Ltd</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isQuoteRequest ? (
                  <>
                    <p className="text-muted-foreground leading-relaxed">
                      We have received your price quotation request. Our team will review your cargo details and contact you
                      shortly with a competitive quote for your shipment.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected response time: <strong>24-48 hours</strong>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground leading-relaxed">
                      We have received your transport request. Our team will review your requirements and contact you
                      shortly with a detailed quote and timeline.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      A confirmation email has been sent to <strong>{formData.requesterEmail}</strong>
                    </p>
                  </>
                )}
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Submit Another Request Via WhatsApp
                  </Button>
                  <Button onClick={() => router.push("/")}>Return to Homepage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Request Transport</h1>
            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
              Fill out the form below and our team will contact you with a customized quote
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Transport Request Form</CardTitle>
                <CardDescription>
                  Provide details about your cargo and our team will prepare a tailored logistics solution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="requesterName">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="requesterName"
                          placeholder="John Doe"
                          required
                          value={formData.requesterName}
                          onChange={(e) => handleChange("requesterName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="ABC Trading Ltd"
                          value={formData.companyName}
                          onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="requesterEmail">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="requesterEmail"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.requesterEmail}
                          onChange={(e) => handleChange("requesterEmail", e.target.value)}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requesterPhone">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="requesterPhone"
                          type="tel"
                          placeholder="+255788 086 288"
                          required
                          value={formData.requesterPhone}
                          onChange={(e) => handleChange("requesterPhone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Type */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Request Type</h3>
                    <div className="space-y-2">
                      <Label htmlFor="requestType">
                        What would you like to do? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.requestType}
                        onValueChange={(value) => handleChange("requestType", value)}
                        required
                      >
                        <SelectTrigger id="requestType">
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price_quote">Get a Price Quotation</SelectItem>
                          <SelectItem value="request_transport">Book a Transport Job</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {formData.requestType === "price_quote"
                          ? "Request a price quote for your shipment (non-binding)"
                          : "Book a confirmed transport job"}
                      </p>
                    </div>
                  </div>

                  {/* Cargo Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cargo Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="containerNumber">Container Number</Label>
                        <Input
                          id="containerNumber"
                          placeholder="ABCD1234567"
                          value={formData.containerNumber}
                          onChange={(e) => handleChange("containerNumber", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Enter your container number to avoid confusion</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargoType">
                          Cargo Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.cargoType}
                          onValueChange={(value) => handleChange("cargoType", value)}
                          required
                        >
                          <SelectTrigger id="cargoType">
                            <SelectValue placeholder="Select cargo type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="container">Container</SelectItem>
                            <SelectItem value="general">General Cargo</SelectItem>
                            <SelectItem value="bulk">Bulk Cargo</SelectItem>
                            <SelectItem value="refrigerated">Refrigerated Goods</SelectItem>
                            <SelectItem value="machinery">Machinery/Equipment</SelectItem>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoWeight">
                        Estimated Weight (tons) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cargoWeight"
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="5.0"
                        required
                        value={formData.cargoWeight}
                        onChange={(e) => handleChange("cargoWeight", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Route Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Route Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation">
                          Pickup Location <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="pickupLocation"
                          placeholder="Dar es Salaam, Tanzania"
                          required
                          value={formData.pickupLocation}
                          onChange={(e) => handleChange("pickupLocation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryLocation">
                          Delivery Location <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="deliveryLocation"
                          placeholder="DR Congo"
                          required
                          value={formData.deliveryLocation}
                          onChange={(e) => handleChange("deliveryLocation", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredDate">Preferred Pickup Date</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleChange("preferredDate", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
                      <Textarea
                        id="specialRequirements"
                        placeholder="Please provide any special handling requirements, delivery instructions, or other relevant information..."
                        rows={4}
                        value={formData.specialRequirements}
                        onChange={(e) => handleChange("specialRequirements", e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send via WhatsApp"}
                      </Button>

                    <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>

                  <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Important:</strong> Once you click the "Send via WhatsApp" button, your request will be submitted immediately. 
                      Please verify that all the information is correct and relevant before submitting.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
