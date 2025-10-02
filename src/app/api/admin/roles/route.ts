import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/rbac';
import { db } from '@/lib/db';
import { roles, userRoles } from '@/lib/schema';
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

    // Fetch all roles with user counts
    const rolesWithCounts = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
        userCount: count(userRoles.userId)
      })
      .from(roles)
      .leftJoin(userRoles, eq(roles.id, userRoles.roleId))
      .groupBy(roles.id);

    return NextResponse.json({ 
      success: true,
      roles: rolesWithCounts
    });

  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}