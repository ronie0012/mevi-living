import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromAuthHeader } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const bearer = getTokenFromAuthHeader(authHeader)
  const cookieToken = req.cookies.get("access_token")?.value

  const token = bearer || cookieToken
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const payload = verifyToken<any>(token)
  if (!payload) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user: { id: payload.sub, email: payload.email, role: payload.role } })
}
