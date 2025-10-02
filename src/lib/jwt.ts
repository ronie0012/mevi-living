import jwt from "jsonwebtoken"

export type Role = "user" | "admin" | "manager"

export interface AccessTokenPayload {
  sub: string // user id
  email: string
  role: Role
}

const ACCESS_EXPIRES_IN = "15m"
const REFRESH_EXPIRES_IN = "7d"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("Missing JWT_SECRET env var")
  return secret
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { algorithm: "HS256", expiresIn: ACCESS_EXPIRES_IN })
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  // include a token type for clarity if needed
  return jwt.sign({ ...payload, t: "refresh" }, getJwtSecret(), { algorithm: "HS256", expiresIn: REFRESH_EXPIRES_IN })
}

export function verifyToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, getJwtSecret()) as unknown as T
  } catch {
    return null
  }
}

export function getTokenFromAuthHeader(authorization?: string | null): string | null {
  if (!authorization) return null
  const [scheme, token] = authorization.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null
  return token
}
