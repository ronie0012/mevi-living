import { createClient } from "@libsql/client"

async function main() {
  const url = process.env.DATABASE_URL || "file:local.db"
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const client = createClient({ url, authToken })

  // Check if role column exists
  const info = await client.execute("PRAGMA table_info('user')")
  const hasRole = Array.isArray(info.rows)
    ? info.rows.some((r: any) => (r.name || r[1]) === "role")
    : false

  if (!hasRole) {
    console.log("Adding role column to user table...")
    await client.execute("ALTER TABLE `user` ADD COLUMN `role` text NOT NULL DEFAULT 'user'")
    console.log("Role column added.")
  } else {
    console.log("Role column already exists. No changes made.")
  }

  await client.close()
}

main().catch((err) => {
  console.error("Patch failed:", err)
  process.exit(1)
})
