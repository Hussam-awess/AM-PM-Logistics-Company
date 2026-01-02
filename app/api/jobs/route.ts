import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const { data, error } = await supabase.from('jobs').insert([
  {
    customer_name: body.customer_name,
    phone: body.phone,

    requester_email: body.details?.requester_email ?? null,
    company_name: body.details?.company_name ?? null,
    container_number: body.details?.container_number ?? null,
    cargo_type: body.details?.cargo_type ?? null,
    cargo_weight_tons: body.details?.cargo_weight_tons ?? null,
    pickup_location: body.details?.pickup_location ?? null,
    delivery_location: body.details?.delivery_location ?? null,
    preferred_date: body.details?.preferred_date ?? null,
    special_requirements: body.details?.special_requirements ?? null,

    status: 'requested',
  },
])


    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Unknown error' }, { status: 500 })
  }
}
