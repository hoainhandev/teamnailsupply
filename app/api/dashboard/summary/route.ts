// app/api/dashboard/summary/route.ts
import { NextResponse, NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { getSessionFromReq } from "@/lib/session"

export async function GET(req: NextRequest) {
  const s = await getSessionFromReq(req)
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: rows, error } = await supabaseAdmin
    .from("commissions")
    .select("amount,status")
    .eq("kol_id", s.kol_id)

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 })

  const orders = rows?.length ?? 0
  const total = (rows ?? []).reduce((sum, r) => sum + Number(r.amount ?? 0), 0)
  const pending = (rows ?? []).filter(r => r.status === "pending").reduce((s, r) => s + Number(r.amount ?? 0), 0)
  const paid = (rows ?? []).filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount ?? 0), 0)

  return NextResponse.json({ orders, total, pending, paid, kol_id: s.kol_id })
}
