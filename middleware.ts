import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin, hasRole, hasPermission } from "@/lib/rbac";
import { validateSession, protectRoute, type RouteConfig, isProtectedRoute, rateLimit } from "@/lib/middleware-helpers";

// Define protected routes with their access requirements
const PROTECTED_ROUTES: RouteConfig[] = [
  {
    path: "/account",
    // Basic auth required, no specific roles
  },
  {
    path: "/admin",
    roles: ["admin"],
    permissions: ["admin:dashboard"]
  },
  {
    path: "/admin/dashboard",
    roles: ["admin"],
    permissions: ["admin:dashboard"]
  },
  {
    path: "/admin/users",
    roles: ["admin"],
    permissions: ["manage:roles"]
  },
  {
    path: "/admin/settings",
    roles: ["admin"],
    permissions: ["manage:permissions"]
  },
  {
    path: "/api/admin",
    roles: ["admin"],
    permissions: ["admin:dashboard"]
  }
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitKey = `api_${clientIP}`;
    
    if (!rateLimit(rateLimitKey, 100, 60000)) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Check if route requires protection
  const routeConfig = isProtectedRoute(pathname, PROTECTED_ROUTES);
  
  if (routeConfig) {
    // Use advanced route protection
    const protectionResult = await protectRoute(request, routeConfig);
    if (protectionResult) {
      return protectionResult; // Redirect or error response
    }
  } else {
    // Basic authentication check for other protected paths
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP header for better security
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
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
    '/api/health',
    '/favicon.ico',
    '/_next',
    '/static'
  ];
  
  return publicPaths.some(path => {
    if (path.endsWith('*')) {
      return pathname.startsWith(path.slice(0, -1));
    }
    return pathname === path || pathname.startsWith(path + '/');
  });
}

export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.gif$|.*\.svg$).*)'
  ],
};
