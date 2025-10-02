"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';
import { CheckoutFormData, Cart } from '@/lib/types';
import { createOrderAction } from '@/app/actions/orders';
import { toast } from 'sonner';

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [buyNowData, setBuyNowData] = useState<Cart | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutFormData>>({});

  // Check for buy-now data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const buyNowDataStr = sessionStorage.getItem('mevi-buy-now');
      if (buyNowDataStr) {
        try {
          const parsedData = JSON.parse(buyNowDataStr);
          console.log('Buy-now data loaded:', parsedData);
          setBuyNowData(parsedData);
        } catch (error) {
          console.error('Error parsing buy-now data:', error);
          sessionStorage.removeItem('mevi-buy-now'); // Clean up corrupted data
        }
      }
    }
  }, []);

  // Determine which cart to use (regular cart or buy-now)
  const checkoutCart = buyNowData || cart;

  // Redirect if no items
  useEffect(() => {
    if (checkoutCart.items.length === 0) {
      console.log('No items in cart, redirecting to cart page');
      router.push('/cart');
    }
  }, [checkoutCart.items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof CheckoutFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutFormData> = {};
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.zipCode) errors.zipCode = 'ZIP code is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateOrderSummary = () => {
    const subtotal = checkoutCart.totalPrice;
    const shippingCost = formData.shippingMethod === 'express' ? 199 : (subtotal > 999 ? 0 : 99);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shippingCost + tax;
    
    return { subtotal, shippingCost, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    console.log('Starting checkout process...');
    setIsProcessing(true);

    try {
      const { subtotal, shippingCost, tax, total } = calculateOrderSummary();
      
      console.log('Order summary:', { subtotal, shippingCost, tax, total });
      console.log('Cart items:', checkoutCart.items);

      // Create order in database using server action
      const orderData = {
        email: formData.email,
        items: checkoutCart.items,
        formData,
        orderSummary: {
          subtotal,
          shippingCost,
          tax,
          total,
        },
      };

      console.log('Submitting order data:', orderData);

      const result = await createOrderAction(orderData);
      console.log('Order creation result:', result);
      
      if (!result.success) {
        console.error('Order creation failed:', result.error);
        throw new Error(result.error || 'Failed to create order');
      }
      
      // Clear cart or buy-now data
      if (buyNowData) {
        console.log('Clearing buy-now data from session storage');
        sessionStorage.removeItem('mevi-buy-now');
        setBuyNowData(null);
      } else {
        console.log('Clearing cart');
        clearCart();
      }

      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      console.log('Redirecting to order confirmation:', result.order.orderNumber);
      router.push(`/order-confirmation?order=${result.order.orderNumber}`);
      
    } catch (error) {
      console.error('Order processing error:', error);
      toast.error('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const { subtotal, shippingCost, tax, total } = calculateOrderSummary();

  // Loading state while redirecting
  if (checkoutCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/cart"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>
          {buyNowData && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
              Express Checkout
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-display text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.email ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="your@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-display text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.firstName ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-destructive text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.lastName ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-destructive text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.address ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Street address"
                  />
                  {formErrors.address && (
                    <p className="text-destructive text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.city ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-destructive text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.state ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.state && (
                      <p className="text-destructive text-xs mt-1">{formErrors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.zipCode ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.zipCode && (
                      <p className="text-destructive text-xs mt-1">{formErrors.zipCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.phone ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {formErrors.phone && (
                    <p className="text-destructive text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-display text-xl font-semibold mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <Truck className="h-5 w-5 text-foreground/60" />
                    <div className="flex-1">
                      <p className="font-medium">Standard Delivery</p>
                      <p className="text-sm text-foreground/60">5-7 business days</p>
                    </div>
                    <p className="font-medium">
                      {subtotal > 999 ? 'FREE' : formatPrice(99)}
                    </p>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <Truck className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Express Delivery</p>
                      <p className="text-sm text-foreground/60">2-3 business days</p>
                    </div>
                    <p className="font-medium">{formatPrice(199)}</p>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <CreditCard className="h-5 w-5 text-foreground/60" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-foreground/60">Secure payment via Stripe</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <div className="h-5 w-5 bg-primary rounded text-primary-foreground text-xs flex items-center justify-center font-bold">
                      U
                    </div>
                    <div>
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-foreground/60">Pay using UPI apps</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <Shield className="h-5 w-5 text-foreground/60" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-foreground/60">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg p-6 border border-border h-fit">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {checkoutCart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <p className="text-foreground/60 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({checkoutCart.totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="bg-secondary/50 rounded p-3">
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <Shield className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}