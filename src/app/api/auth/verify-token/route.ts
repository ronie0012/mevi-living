import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required in request body' },
        { status: 400 }
      );
    }

    const payload = verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid or expired token' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      payload,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('JWT token verification error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Token verification failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check Authorization header
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
        { 
          success: false,
          error: 'Invalid or expired token' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      payload,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('JWT token verification error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Token verification failed' 
      },
      { status: 500 }
    );
  }
}