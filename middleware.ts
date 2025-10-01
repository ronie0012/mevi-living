import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
 
export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers()
	})
 
	if(!session) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(signInUrl);
	}
 
	return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/account"], // Only protect account page, cart can be viewed without auth
};