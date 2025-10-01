'use server';

import { createOrder as createOrderDB } from '@/lib/orders';
import { CreateOrderData } from '@/lib/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function createOrderAction(orderData: Omit<CreateOrderData, 'userId'>) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const orderDataWithUser: CreateOrderData = {
      ...orderData,
      userId: session?.user?.id,
    };

    const order = await createOrderDB(orderDataWithUser);
    
    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      }
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order'
    };
  }
}