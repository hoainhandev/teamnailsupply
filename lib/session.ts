// lib/session.ts
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import type { NextResponse } from "next/server"

const COOKIE_NAME = "kol_session"

function secretKey() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error("Missing SESSION_SECRET")
  return new TextEncoder().encode(s)
}

export type SessionPayload = {
  kol_id: string
}

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey())
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secretKey())
  return payload as unknown as SessionPayload
}

// ✅ SET cookie trên NextResponse (đừng dùng cookies().set)
export async function setSessionCookie(res: NextResponse, payload: SessionPayload) {
  const token = await signSession(payload)
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 })
  return res
}

// ✅ Đọc cookie từ req (ổn định nhất)
export async function getSessionFromReq(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await verifySession(token)
  } catch {
    return null
  }
}
