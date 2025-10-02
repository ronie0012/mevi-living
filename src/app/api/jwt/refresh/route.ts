import { NextRequest, NextResponse } from "next/server"
import { verifyToken, signAccessToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    const refresh = req.cookies.get("refresh_token")?.value
    if (!refresh) return NextResponse.json({ error: "Missing refresh token" }, { status: 401 })

    const payload = verifyToken<any>(refresh)
    if (!payload || payload.t !== "refresh") {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    const accessToken = signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role })

    const res = NextResponse.json({ ok: true })
    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    })

    return res
  } catch (err) {
    console.error("JWT refresh error", err)
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 400 })
  }
}
