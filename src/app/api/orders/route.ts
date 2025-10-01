import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId, getOrdersByEmail } from '@/lib/orders';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '10');

    let orders = [];

    if (session?.user) {
      // User is logged in - get orders by user ID
      orders = await getOrdersByUserId(session.user.id, limit);
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