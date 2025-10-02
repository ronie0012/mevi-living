import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/rbac';
import { db } from '@/lib/db';
import { user, roles, permissions, userRoles } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin access
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const hasAdminRole = await isAdmin(session.user.id);
    if (!hasAdminRole) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get stats in parallel
    const [totalUsers, totalRoles, totalPermissions, adminUsers] = await Promise.all([
      // Total users count
      db.select({ count: count() }).from(user),
      
      // Total roles count
      db.select({ count: count() }).from(roles),
      
      // Total permissions count
      db.select({ count: count() }).from(permissions),
      
      // Admin users count - users with admin role
      db
        .select({ count: count() })
        .from(userRoles)
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(roles.name, 'admin'))
    ]);

    const stats = {
      totalUsers: totalUsers[0]?.count || 0,
      totalRoles: totalRoles[0]?.count || 0,
      totalPermissions: totalPermissions[0]?.count || 0,
      adminUsers: adminUsers[0]?.count || 0,
    };

    return NextResponse.json({ 
      success: true,
      stats
    });

  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}