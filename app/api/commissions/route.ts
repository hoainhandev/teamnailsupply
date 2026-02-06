// app/api/dashboard/commissions/route.ts
import { NextResponse, NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { getSessionFromReq } from "@/lib/session"

export async function GET(req: NextRequest) {
  const s = await getSessionFromReq(req)
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const status = url.searchParams.get("status") // pending|approved|paid|null
  const q = url.searchParams.get("q") // search order id optional

  let query = supabaseAdmin
    .from("commissions")
    .select("shopify_order_id, amount, status, created_at")
    .eq("kol_id", s.kol_id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (status && ["pending", "approved", "paid"].includes(status)) query = query.eq("status", status)
  if (q) query = query.ilike("shopify_order_id", `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 })

return NextResponse.json(data ?? [])
}
