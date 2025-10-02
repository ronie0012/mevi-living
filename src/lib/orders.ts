import { db } from './db';
import { orders, orderItems } from '../db/schema';
import { CreateOrderData, Order } from './types';
import { eq, desc, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Generate a unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.random().toString(36).substr(2, 4).toUpperCase(); // 4 random chars
  return `ORD-${timestamp}-${random}`;
}

// Convert price from rupees to paisa (for database storage)
function toPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}

// Convert price from paisa to rupees (for display)
function toRupees(paisa: number): number {
  return paisa / 100;
}

// Create a new order
export async function createOrder(data: CreateOrderData): Promise<Order> {
  const orderId = nanoid();
  const orderNumber = generateOrderNumber();
  const now = new Date();

  try {
    // Start transaction
    await db.transaction(async (tx) => {
      // Insert order
      await tx.insert(orders).values({
        id: orderId,
        orderNumber,
        userId: data.userId || null,
        email: data.email,
        status: 'pending',
        subtotal: toPaisa(data.orderSummary.subtotal),
        shippingCost: toPaisa(data.orderSummary.shippingCost),
        tax: toPaisa(data.orderSummary.tax),
        total: toPaisa(data.orderSummary.total),
        shippingFirstName: data.formData.firstName,
        shippingLastName: data.formData.lastName,
        shippingAddress: data.formData.address,
        shippingCity: data.formData.city,
        shippingState: data.formData.state,
        shippingZipCode: data.formData.zipCode,
        shippingPhone: data.formData.phone,
        shippingMethod: data.formData.shippingMethod,
        paymentMethod: data.formData.paymentMethod,
        paymentStatus: data.formData.paymentMethod === 'cod' ? 'pending' : 'paid',
        createdAt: now,
        updatedAt: now,
      });

      // Insert order items
      for (const item of data.items) {
        await tx.insert(orderItems).values({
          id: nanoid(),
          orderId,
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name,
          price: toPaisa(item.price),
          quantity: item.quantity,
          image: item.image,
          createdAt: now,
        });
      }
    });

    // Fetch and return the created order
    const createdOrder = await getOrderById(orderId);
    if (!createdOrder) {
      throw new Error('Failed to create order');
    }

    return createdOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (orderResult.length === 0) {
      return null;
    }

    const order = orderResult[0];

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .orderBy(orderItems.createdAt);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId || undefined,
      email: order.email,
      status: order.status as any,
      subtotal: toRupees(order.subtotal),
      shippingCost: toRupees(order.shippingCost),
      tax: toRupees(order.tax),
      total: toRupees(order.total),
      shippingFirstName: order.shippingFirstName,
      shippingLastName: order.shippingLastName,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZipCode: order.shippingZipCode,
      shippingPhone: order.shippingPhone,
      shippingMethod: order.shippingMethod as any,
      paymentMethod: order.paymentMethod as any,
      paymentStatus: order.paymentStatus as any,
      notes: order.notes || undefined,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      items: items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        variantId: item.variantId || undefined,
        name: item.name,
        price: toRupees(item.price),
        quantity: item.quantity,
        image: item.image,
        createdAt: new Date(item.createdAt),
      })),
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (orderResult.length === 0) {
      return null;
    }

    return getOrderById(orderResult[0].id);
  } catch (error) {
    console.error('Error fetching order by number:', error);
    return null;
  }
}

// Get orders for a user
export async function getOrdersByUserId(userId: string, limit = 10): Promise<Order[]> {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    const orderPromises = userOrders.map(order => getOrderById(order.id));
    const orderResults = await Promise.all(orderPromises);
    
    return orderResults.filter(order => order !== null) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// Get orders by email (for guest users)
export async function getOrdersByEmail(email: string, limit = 10): Promise<Order[]> {
  try {
    const emailOrders = await db
      .select()
      .from(orders)
      .where(and(eq(orders.email, email), eq(orders.userId, null)))
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    const orderPromises = emailOrders.map(order => getOrderById(order.id));
    const orderResults = await Promise.all(orderPromises);
    
    return orderResults.filter(order => order !== null) as Order[];
  } catch (error) {
    console.error('Error fetching email orders:', error);
    return [];
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  paymentStatus?: Order['paymentStatus']
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId));

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Get order status display text
export function getOrderStatusDisplay(status: Order['status']): { text: string; color: string } {
  switch (status) {
    case 'pending':
      return { text: 'Order Placed', color: 'text-blue-600' };
    case 'processing':
      return { text: 'Processing', color: 'text-yellow-600' };
    case 'shipped':
      return { text: 'Shipped', color: 'text-purple-600' };
    case 'delivered':
      return { text: 'Delivered', color: 'text-green-600' };
    case 'cancelled':
      return { text: 'Cancelled', color: 'text-red-600' };
    default:
      return { text: 'Unknown', color: 'text-gray-600' };
  }
}

// Get payment status display text
export function getPaymentStatusDisplay(status: Order['paymentStatus']): { text: string; color: string } {
  switch (status) {
    case 'pending':
      return { text: 'Payment Pending', color: 'text-yellow-600' };
    case 'paid':
      return { text: 'Paid', color: 'text-green-600' };
    case 'failed':
      return { text: 'Payment Failed', color: 'text-red-600' };
    case 'refunded':
      return { text: 'Refunded', color: 'text-blue-600' };
    default:
      return { text: 'Unknown', color: 'text-gray-600' };
  }
}