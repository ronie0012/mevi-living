import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import * as schema from "./schema"
import { nanoid } from "nanoid"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || "fallback-secret-key-change-in-production"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    generateId: () => nanoid(),
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  // Enhanced security settings
  rateLimit: {
    window: 60, // 1 minute
    max: 100, // 100 requests per minute
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  // We'll handle role assignment in a different way since hooks are causing issues
})

// JWT utilities
export const generateJWT = (payload: any, expiresIn: string = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
