import { db } from "./db"
import { user, account } from "./schema"
import { eq, and, isNotNull } from "drizzle-orm"
import bcrypt from "bcrypt"

export async function getUserWithPasswordByEmail(email: string): Promise<{ id: string; email: string; role: string; passwordHash: string } | null> {
  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      role: user.role,
      password: account.password,
    })
    .from(user)
    .leftJoin(account, eq(account.userId, user.id))
    .where(and(eq(user.email, email), isNotNull(account.password)))
    .limit(1)

  const row = rows[0]
  if (!row || !row.password) return null
  return { id: row.id, email: row.email, role: row.role, passwordHash: row.password }
}

export async function verifyCredentials(email: string, password: string): Promise<{ id: string; email: string; role: string } | null> {
  const rec = await getUserWithPasswordByEmail(email)
  if (!rec) return null
  const match = await bcrypt.compare(password, rec.passwordHash)
  if (!match) return null
  return { id: rec.id, email: rec.email, role: rec.role }
}
