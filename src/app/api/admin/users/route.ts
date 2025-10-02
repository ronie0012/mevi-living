import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin, getUserRoles } from '@/lib/rbac';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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

    // Fetch all users
    const users = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }).from(user);

    // Get roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async (u) => {
        const roles = await getUserRoles(u.id);
        return {
          ...u,
          roles,
          createdAt: u.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      users: usersWithRoles
    });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}