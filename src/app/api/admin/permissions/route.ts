import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/rbac';
import { db } from '@/lib/db';
import { permissions } from '@/lib/schema';

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

    // Fetch all permissions
    const allPermissions = await db.select().from(permissions);

    return NextResponse.json({ 
      success: true,
      permissions: allPermissions
    });

  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}