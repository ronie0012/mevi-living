import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const hasAdminRole = await isAdmin(session.user.id);
    
    if (!hasAdminRole) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin access granted',
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });

  } catch (error) {
    console.error('Admin access check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}