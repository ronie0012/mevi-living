import { NextRequest, NextResponse } from 'next/server';
import { auth, generateJWT } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Sign-in endpoint', 
    method: 'POST',
    requiredFields: ['email', 'password']
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // For testing purposes, we'll create mock authentication
    // In a real app, you would validate against your database
    if (email === 'admin@localhost.com' && password === 'admin123') {
      const userPayload = {
        id: 'user_123',
        email: email,
        role: 'admin'
      };

      const token = generateJWT(userPayload);

      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: token,
        user: userPayload
      });
    }

    // Mock regular user for testing
    if (email === 'user@localhost.com' && password === 'user123') {
      const userPayload = {
        id: 'user_456',
        email: email,
        role: 'user'
      };

      const token = generateJWT(userPayload);

      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: token,
        user: userPayload
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid credentials'
      },
      { status: 401 }
    );

  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}