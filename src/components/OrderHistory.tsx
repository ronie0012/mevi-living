"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar, Eye } from 'lucide-react';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/products';
// Remove database imports - these will be handled server-side
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderHistoryProps {
  userId?: string;
  email?: string;
}

// Status display functions (moved from server-side utils)
const getOrderStatusDisplay = (status: Order['status']): { text: string; color: string } => {
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
};

const getPaymentStatusDisplay = (status: Order['paymentStatus']): { text: string; color: string } => {
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
};

export const OrderHistory: React.FC<OrderHistoryProps> = ({ userId, email }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (email) {
          queryParams.append('email', email);
        }
        
        const response = await fetch(`/api/orders?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId || email) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [userId, email]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Loading your order history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Failed to load order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track your recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No orders yet. Start shopping to see your order history here.
            </p>
            <Button asChild>
              <Link href="/collections">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusDisplay = getOrderStatusDisplay(order.status);
            const paymentDisplay = getPaymentStatusDisplay(order.paymentStatus);
            
            return (
              <div key={order.id} className="border rounded-lg p-4 space-y-4">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`${statusDisplay.color} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{statusDisplay.text}</span>
                      </Badge>
                    </div>
                    <span className="font-semibold text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Order Actions and Details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Payment: {paymentDisplay.text}</span>
                    <span>Items: {order.items.length}</span>
                    <span>Shipping: {order.shippingMethod === 'express' ? 'Express' : 'Standard'}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm" disabled>
                        <Truck className="h-3 w-3 mr-1" />
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length >= 10 && (
          <div className="text-center pt-4 border-t mt-4">
            <Button variant="outline" disabled>
              Load More Orders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};