import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { jwtVerify } from "jose";
 
function getBearer(authorization: string | null): string | null {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
 
async function verifyJwt(token: string): Promise<any | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}
 
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // JWT RBAC for admin APIs
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    const bearer = getBearer(authHeader);
    const cookieToken = request.cookies.get("access_token")?.value;
    const token = bearer || cookieToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const role = payload.role as string | undefined;
    if (!role || (role !== "admin" && role !== "manager")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // forward user headers
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set("x-user-id", payload.sub as string);
    reqHeaders.set("x-user-email", payload.email as string);
    reqHeaders.set("x-user-role", role);

    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  // Protect the account page using existing session auth
	const session = await auth.api.getSession({
		headers: await headers()
	})
 
	if(!session && pathname.startsWith("/account")) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(signInUrl);
	}
 
	return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: [
    "/account",
    "/api/admin/:path*",
  ], // Only protect account page plus admin APIs
};
