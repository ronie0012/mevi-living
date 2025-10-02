import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin, assignRole } from '@/lib/rbac';

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

    // Validate role name
    const validRoles = ['admin', 'moderator', 'user'];
    if (!validRoles.includes(roleName)) {
      return NextResponse.json(
        { error: 'Invalid role name' },
        { status: 400 }
      );
    }

    // Assign the role
    const success = await assignRole(userId, roleName);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to assign role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Role '${roleName}' assigned successfully`
    });

  } catch (error) {
    console.error('Failed to assign role:', error);
    return NextResponse.json(
      { error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}