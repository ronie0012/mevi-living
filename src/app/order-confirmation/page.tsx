"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'N/A';

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-2xl">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-foreground/70 mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-sm text-foreground/60">
              Order number: <span className="font-mono font-medium">{orderNumber}</span>
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-card rounded-lg p-6 border border-border text-left">
            <h2 className="font-display text-xl font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Order confirmation email</h3>
                  <p className="text-sm text-foreground/70">
                    We've sent you a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Order processing</h3>
                  <p className="text-sm text-foreground/70">
                    Your order is being prepared and will be shipped within 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery</h3>
                  <p className="text-sm text-foreground/70">
                    Your items will be delivered to your specified address. You'll receive tracking updates via email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections"
              className="bg-primary text-primary-foreground py-3 px-6 rounded-sm font-medium transition-colors hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="border border-primary text-primary py-3 px-6 rounded-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Back to Home
            </Link>
          </div>

          {/* Support Information */}
          <div className="bg-secondary/30 rounded-lg p-6 text-center">
            <h3 className="font-medium mb-2">Need help with your order?</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Contact our customer support team if you have any questions about your order.
            </p>
            <div className="text-sm space-y-1">
              <p>Email: <a href="mailto:support@meviliving.com" className="text-primary hover:underline">support@meviliving.com</a></p>
              <p>Phone: <a href="tel:+91-98765-43210" className="text-primary hover:underline">+91 98765 43210</a></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}