export type Role = "user" | "admin" | "manager"

export function hasRequiredRole(userRole: Role | undefined, allowed: Role[] = ["user"]): boolean {
  if (!userRole) return false
  return allowed.includes(userRole)
}

export function requireRole(userRole: Role | undefined, allowed: Role[] = ["user"]): { ok: true } | { ok: false; status: number; message: string } {
  if (hasRequiredRole(userRole, allowed)) return { ok: true }
  return { ok: false, status: 403, message: "Forbidden: insufficient role" }
}
