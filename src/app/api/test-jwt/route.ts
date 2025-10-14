import { NextRequest, NextResponse } from 'next/server';
import { validateSession, generateAPIToken } from '@/lib/middleware-helpers';
import { verifyJWT } from '@/lib/auth';

// Test endpoint to generate JWT token
export async function POST(request: NextRequest) {
  try {
    const authResponse = await validateSession(request);
    
    if (!authResponse.success || !authResponse.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate JWT token for the authenticated user
    const token = generateAPIToken(
      authResponse.user.id,
      ['user'], // Default role
      '24h' // Expires in 24 hours
    );

    return NextResponse.json({
      success: true,
      token,
      user: authResponse.user,
      message: 'JWT token generated successfully'
    });

  } catch (error) {
    console.error('JWT generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWT token' },
      { status: 500 }
    );
  }
}

// Test endpoint to verify JWT token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization header with Bearer token required' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      payload,
      message: 'JWT token is valid'
    });

  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}