import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId, getOrdersByEmail } from '@/lib/orders';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getTokenFromAuthHeader, verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Prefer JWT from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const bearer = getTokenFromAuthHeader(authHeader);
    const cookieToken = request.cookies.get('access_token')?.value;
    const token = bearer || cookieToken;

    let userId: string | null = null;

    if (token) {
      const payload = verifyToken<any>(token);
      if (payload) {
        userId = payload.sub as string;
      }
    }

    // Fallback to session from better-auth if no valid JWT
    let sessionUserId: string | null = null;
    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers()
      });
      if (session?.user?.id) {
        sessionUserId = session.user.id;
      }
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '10');

    let orders = [] as any[];

    if (userId || sessionUserId) {
      // Authenticated user - get orders by user ID
      orders = await getOrdersByUserId((userId || sessionUserId) as string, limit);
    } else if (email) {
      // Guest user - get orders by email
      orders = await getOrdersByEmail(email, limit);
    } else {
      return NextResponse.json({ error: 'Authentication required or email parameter missing' }, { status: 401 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
