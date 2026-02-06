// app/api/me/route.ts
import { NextResponse, NextRequest } from "next/server"
import { getSessionFromReq } from "@/lib/session"

export async function GET(req: NextRequest) {
  const s = await getSessionFromReq(req)
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ kol_id: s.kol_id })
}
