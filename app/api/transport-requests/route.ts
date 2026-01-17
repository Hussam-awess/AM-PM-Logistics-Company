import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      requester_name,
      requester_email,
      requester_phone,
      company_name,
      container_number,
      cargo_type,
      cargo_weight_tons,
      pickup_location,
      delivery_location,
      preferred_date,
      special_requirements,
      request_type,
      status,
    } = body

    // Validate required fields
    if (
      !requester_name ||
      !requester_email ||
      !requester_phone ||
      !cargo_type ||
      !cargo_weight_tons ||
      !pickup_location ||
      !delivery_location
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert the transport request
    const { data, error } = await supabase
      .from("transport_requests")
      .insert({
        requester_name,
        requester_email,
        requester_phone,
        company_name,
        container_number,
        cargo_type,
        cargo_weight_tons: Number.parseFloat(cargo_weight_tons),
        pickup_location,
        delivery_location,
        preferred_date,
        special_requirements,
        request_type: request_type || "price_quote",
        status: status || "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error inserting transport request:", error)
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in transport requests API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "driver"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase.from("transport_requests").select("*").order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching transport requests:", error)
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error in transport requests GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
