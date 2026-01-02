import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("trucks").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching trucks:", error)
      return NextResponse.json({ error: "Failed to fetch trucks" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error in trucks GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { plate_number, model, capacity_tons, status, location, last_maintenance } = body

    if (!plate_number || !model || !capacity_tons) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("trucks")
      .insert({
        plate_number,
        model,
        capacity_tons: Number.parseFloat(capacity_tons),
        status: status || "available",
        location,
        last_maintenance,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating truck:", error)
      return NextResponse.json({ error: "Failed to create truck" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in trucks POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
