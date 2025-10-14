import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Simplified middleware to avoid build issues
// Full middleware functionality can be restored later if needed

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes and chat-related routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Basic rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    // Simple in-memory rate limiting (for production, use Redis or similar)
    // For now, just let API requests pass through
  }

  // Add basic security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  
  return response;
}

// Helper function to determine if a route is public
function isPublicRoute(pathname: string): boolean {
  const publicPaths = [
    '/',
    '/sign-in',
    '/sign-up', 
    '/login',
    '/register',
    '/api/auth',
    '/api/socket',
    '/api/chat',
    '/api/health',
    '/favicon.ico',
    '/_next',
    '/static',
    '/collections',
    '/products'
  ];
  
  return publicPaths.some(path => {
    return pathname === path || pathname.startsWith(path + '/');
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js)$).*)'
  ],
};
