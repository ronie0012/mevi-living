import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { generateAPIToken } from '@/lib/middleware-helpers';
import { getUserRoles } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated via session
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please login first.' },
        { status: 401 }
      );
    }

    // Get user roles for the token
    const userRoles = await getUserRoles(session.user.id);

    // Parse request body for token options
    const body = await request.json().catch(() => ({}));
    const expiresIn = body.expiresIn || '24h'; // Default 24 hours
    const tokenName = body.name || 'API Access Token';

    // Generate JWT token
    const token = generateAPIToken(
      session.user.id,
      userRoles,
      expiresIn
    );

    return NextResponse.json({
      success: true,
      token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        roles: userRoles
      },
      message: `JWT token generated successfully (${tokenName})`
    });

  } catch (error) {
    console.error('JWT token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWT token' },
      { status: 500 }
    );
  }
}