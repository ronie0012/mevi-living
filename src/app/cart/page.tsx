"use client";

import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/products'
import { toast } from 'sonner'

// Note: Since this is a client component, we can't export metadata
// Instead, set metadata in a parent server component or layout

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl mb-8">Shopping Cart</h1>
          
          {/* Empty Cart State */}
          <div className="bg-card rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-foreground/40" />
              </div>
              <h2 className="font-display text-2xl mb-4">Your cart is empty</h2>
              <p className="text-foreground/60 mb-6">
                Start shopping and add items to your cart to see them here.
              </p>
              <Link
                href="/collections"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl md:text-5xl">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive/90 text-sm font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-6 border border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-display text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-foreground/70 text-sm mb-4">
                      Price: {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-border min-w-[3rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-2 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive/90 p-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.maxStock - item.quantity} remaining in stock
                    </p>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="bg-card rounded-lg p-6 border border-border h-fit">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              {shipping > 0 && subtotal < 999 && (
                <p className="text-xs text-muted-foreground border-t pt-3">
                  Add {formatPrice(999 - subtotal)} more for free shipping!
                </p>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-sm font-medium text-center transition-colors hover:bg-primary/90 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link
                href="/collections"
                className="w-full border border-primary text-primary py-3 px-6 rounded-sm font-medium text-center transition-colors hover:bg-primary hover:text-primary-foreground block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
