import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin, removeRole } from '@/lib/rbac';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const { userId, roleName } = await request.json();

    if (!userId || !roleName) {
      return NextResponse.json(
        { error: 'userId and roleName are required' },
        { status: 400 }
      );
    }

    // Prevent removing admin role from current user (to avoid lockout)
    if (userId === session.user.id && roleName === 'admin') {
      return NextResponse.json(
        { error: 'Cannot remove admin role from yourself' },
        { status: 400 }
      );
    }

    // Remove the role
    const success = await removeRole(userId, roleName);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Role '${roleName}' removed successfully`
    });

  } catch (error) {
    console.error('Failed to remove role:', error);
    return NextResponse.json(
      { error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}