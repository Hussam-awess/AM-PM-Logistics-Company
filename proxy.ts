import { updateSession } from "@/lib/supabase/proxy"
import type { NextRequest } from "next/server"

// Next.js proxy entrypoint — this function is executed for each incoming
// request that matches the configured `matcher`. It delegates to the
// `updateSession` helper which handles Supabase session cookies and
// optional admin-route protection.
export async function proxy(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
