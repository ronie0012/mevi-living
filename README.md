This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Authentication (JWT + RBAC)

This project includes a full JWT-based authentication layer with role-based access control (RBAC), added on top of existing session auth.

- Access token: signed JWT (15 minutes) stored as HttpOnly cookie `access_token`
- Refresh token: signed JWT (7 days) stored as HttpOnly cookie `refresh_token`
- Roles: `user` (default), `admin`, `manager`

Environment variables:

- `JWT_SECRET` (required) – secret for signing JWTs

Database changes:

- Added `role` column to `user` table (default `user`). Generate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

API routes:

- POST `/api/jwt/login` – body: `{ "email": string, "password": string }`
- POST `/api/jwt/refresh` – refreshes access token from cookie
- POST `/api/jwt/logout` – clears auth cookies
- GET `/api/jwt/me` – returns `{ user: { id, email, role } }` from access token

Protected routes:

- Admin APIs under `/api/admin/*` are enforced by middleware and require `admin` or `manager` role.
- The Account page `/account` remains protected by session auth via Better Auth.

Usage examples (PowerShell / curl):

```powershell
# Login (stores cookies)
curl -i -X POST http://localhost:3000/api/jwt/login `
  -H "Content-Type: application/json" `
  -d '{"email":"user@example.com","password":"password123"}'

# Get current user (sends cookies automatically if you use a client that preserves them)
curl -i http://localhost:3000/api/jwt/me

# Refresh access token
curl -i -X POST http://localhost:3000/api/jwt/refresh

# Logout
curl -i -X POST http://localhost:3000/api/jwt/logout
```

Implementation files:

- `src/lib/jwt.ts` – sign/verify tokens
- `src/lib/user-auth.ts` – email/password verification via bcrypt
- `src/lib/rbac.ts` – role helpers
- `src/app/api/jwt/*` – JWT API routes
- `middleware.ts` – protects `/api/admin/*` with JWT RBAC and `/account` with session auth
- `src/app/api/orders/route.ts` – supports JWT auth (Bearer or cookie) and falls back to session
