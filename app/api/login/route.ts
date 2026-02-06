// app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase-server"
import { setSessionCookie } from "@/lib/session"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const kol_id = String(body.kol_id ?? "").trim()
  const password = String(body.password ?? "")

  if (!kol_id || !password) {
    return NextResponse.json({ error: "Missing kol_id or password" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("kol_credentials")
    .select("kol_id,password_hash")
    .eq("kol_id", kol_id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 })
  if (!data?.password_hash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const ok = await bcrypt.compare(password, data.password_hash)
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const res = NextResponse.json({ ok: true, kol_id: data.kol_id })
  await setSessionCookie(res, { kol_id: data.kol_id })
  return res
}
