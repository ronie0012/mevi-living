import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifyCredentials } from "@/lib/user-auth"
import { signAccessToken, signRefreshToken } from "@/lib/jwt"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = LoginSchema.parse(body)

    const user = await verifyCredentials(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as any })
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role: user.role as any })

    const res = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })
    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15m
    })
    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7d
    })

    return res
  } catch (err: any) {
    console.error("JWT login error", err)
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
