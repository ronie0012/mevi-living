import { NextRequest, NextResponse } from 'next/server';
import { auth, generateJWT, verifyJWT } from './auth';
import { headers } from 'next/headers';
import { getUserRoles, getUserPermissions, hasRole, hasPermission, type UserRole, type Permission } from './rbac';

// JWT Auth Response type
export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
}

// Enhanced session validation with JWT fallback
export async function validateSession(request: NextRequest): Promise<AuthResponse> {
  try {
    // First try Better Auth session
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (session?.user) {
      return {
        success: true,
        user: session.user,
        session: session
      };
    }

    // Fallback to JWT token validation
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      const jwtPayload = verifyJWT(token);
      if (jwtPayload && typeof jwtPayload === 'object' && 'userId' in jwtPayload) {
        return {
          success: true,
          user: { id: jwtPayload.userId },
          session: null
        };
      }
    }

    return {
      success: false,
      error: 'No valid session or token found'
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      success: false,
      error: 'Session validation failed'
    };
  }
}

// Role-based middleware factory
export function requireRole(requiredRole: UserRole) {
  return async function roleMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const authResponse = await validateSession(request);
    
    if (!authResponse.success || !authResponse.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userHasRole = await hasRole(authResponse.user.id, requiredRole);
    
    if (!userHasRole) {
      return NextResponse.json(
        { error: `Access denied. Required role: ${requiredRole}` },
        { status: 403 }
      );
    }

    return null; // Allow access
  };
}

// Permission-based middleware factory
export function requirePermission(requiredPermission: Permission) {
  return async function permissionMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const authResponse = await validateSession(request);
    
    if (!authResponse.success || !authResponse.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userHasPermission = await hasPermission(authResponse.user.id, requiredPermission);
    
    if (!userHasPermission) {
      return NextResponse.json(
        { error: `Access denied. Required permission: ${requiredPermission}` },
        { status: 403 }
      );
    }

    return null; // Allow access
  };
}

// Multiple roles middleware (user must have at least one of the roles)
export function requireAnyRole(roles: UserRole[]) {
  return async function anyRoleMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const authResponse = await validateSession(request);
    
    if (!authResponse.success || !authResponse.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userRoles = await getUserRoles(authResponse.user.id);
    const hasAnyRole = roles.some(role => userRoles.includes(role));
    
    if (!hasAnyRole) {
      return NextResponse.json(
        { error: `Access denied. Required one of roles: ${roles.join(', ')}` },
        { status: 403 }
      );
    }

    return null; // Allow access
  };
}

// Multiple permissions middleware (user must have at least one permission)
export function requireAnyPermission(permissions: Permission[]) {
  return async function anyPermissionMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const authResponse = await validateSession(request);
    
    if (!authResponse.success || !authResponse.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userPermissions = await getUserPermissions(authResponse.user.id);
    const hasAnyPermission = permissions.some(permission => userPermissions.includes(permission));
    
    if (!hasAnyPermission) {
      return NextResponse.json(
        { error: `Access denied. Required one of permissions: ${permissions.join(', ')}` },
        { status: 403 }
      );
    }

    return null; // Allow access
  };
}

// Admin only middleware
export const requireAdmin = requireRole('admin');

// Authenticated user middleware (any valid user)
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const authResponse = await validateSession(request);
  
  if (!authResponse.success || !authResponse.user) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return null; // Allow access
}

// Route protection configuration
export interface RouteConfig {
  path: string;
  roles?: UserRole[];
  permissions?: Permission[];
  anyRole?: boolean; // If true, user needs any of the roles. If false, user needs all roles
  anyPermission?: boolean; // If true, user needs any of the permissions. If false, user needs all permissions
}

// Advanced middleware for complex route protection
export async function protectRoute(request: NextRequest, config: RouteConfig): Promise<NextResponse | null> {
  const authResponse = await validateSession(request);
  
  if (!authResponse.success || !authResponse.user) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  const userId = authResponse.user.id;

  // Check roles if specified
  if (config.roles && config.roles.length > 0) {
    const userRoles = await getUserRoles(userId);
    
    if (config.anyRole) {
      // User needs at least one of the specified roles
      const hasAnyRole = config.roles.some(role => userRoles.includes(role));
      if (!hasAnyRole) {
        return NextResponse.json(
          { error: `Access denied. Required one of roles: ${config.roles.join(', ')}` },
          { status: 403 }
        );
      }
    } else {
      // User needs all specified roles
      const hasAllRoles = config.roles.every(role => userRoles.includes(role));
      if (!hasAllRoles) {
        return NextResponse.json(
          { error: `Access denied. Required all roles: ${config.roles.join(', ')}` },
          { status: 403 }
        );
      }
    }
  }

  // Check permissions if specified
  if (config.permissions && config.permissions.length > 0) {
    const userPermissions = await getUserPermissions(userId);
    
    if (config.anyPermission) {
      // User needs at least one of the specified permissions
      const hasAnyPermission = config.permissions.some(permission => userPermissions.includes(permission));
      if (!hasAnyPermission) {
        return NextResponse.json(
          { error: `Access denied. Required one of permissions: ${config.permissions.join(', ')}` },
          { status: 403 }
        );
      }
    } else {
      // User needs all specified permissions
      const hasAllPermissions = config.permissions.every(permission => userPermissions.includes(permission));
      if (!hasAllPermissions) {
        return NextResponse.json(
          { error: `Access denied. Required all permissions: ${config.permissions.join(', ')}` },
          { status: 403 }
        );
      }
    }
  }

  return null; // Allow access
}

// Generate JWT token for API authentication
export function generateAPIToken(userId: string, roles: string[] = [], expiresIn: string = '24h'): string {
  return generateJWT({
    userId,
    roles,
    type: 'api_token',
    iat: Math.floor(Date.now() / 1000),
  }, expiresIn);
}

// Middleware for API routes
export async function apiMiddleware(request: NextRequest, requiredPermissions?: Permission[]) {
  const authResponse = await validateSession(request);
  
  if (!authResponse.success || !authResponse.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPermissions = await getUserPermissions(authResponse.user.id);
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasRequiredPermissions) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  }

  return {
    user: authResponse.user,
    session: authResponse.session
  };
}

// Utility to check if current path should be protected
export function isProtectedRoute(pathname: string, protectedRoutes: RouteConfig[]): RouteConfig | null {
  return protectedRoutes.find(route => {
    // Simple string match or regex pattern
    if (route.path.includes('*')) {
      const pattern = route.path.replace('*', '.*');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return pathname.startsWith(route.path);
  }) || null;
}

// Rate limiting helper
const rateLimitMap = new Map();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier).filter((time: number) => time > windowStart);
  
  if (requests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  requests.push(now);
  rateLimitMap.set(identifier, requests);
  
  return true; // Within rate limit
}