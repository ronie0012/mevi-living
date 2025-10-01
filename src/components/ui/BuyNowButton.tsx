"use client";

import React, { useState } from 'react';
import { ArrowRight, Loader2, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BuyNowButtonProps {
  product: Product;
  quantity?: number;
  variantId?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  quantity = 1,
  variantId,
  variant = 'outline',
  size = 'md',
  className,
  disabled = false,
}) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    if (!product.inStock || disabled) return;

    // Validate stock
    if (quantity > product.stock) {
      alert(`Cannot purchase ${quantity} items. Only ${product.stock} available in stock.`);
      return;
    }

    setIsProcessing(true);

    try {
      // Create a temporary cart item for checkout
      const checkoutItem = {
        id: variantId ? `${product.id}-${variantId}` : product.id,
        productId: product.id,
        variantId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        maxStock: product.stock,
      };

      // Store the buy-now item in sessionStorage for checkout
      const buyNowData = {
        items: [checkoutItem],
        totalItems: quantity,
        totalPrice: product.price * quantity,
        isBuyNow: true,
      };

      sessionStorage.setItem('mevi-buy-now', JSON.stringify(buyNowData));

      // Navigate to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error processing buy now:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      // Add slight delay for better UX
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const baseClasses = "inline-flex items-center justify-center font-medium text-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-8 text-lg",
  };

  const isButtonDisabled = !product.inStock || isProcessing || disabled;

  return (
    <button
      onClick={handleBuyNow}
      disabled={isButtonDisabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "w-full relative",
        {
          "cursor-not-allowed opacity-50": !product.inStock,
          "opacity-75 cursor-wait": isProcessing,
        },
        className
      )}
      aria-label={`Buy ${product.name} now`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {!product.inStock ? 'OUT OF STOCK' : 'BUY NOW'}
          {product.inStock && <ArrowRight className="w-4 h-4 ml-2" />}
        </>
      )}
    </button>
  );
};