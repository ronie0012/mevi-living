"use client";

import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showQuantitySelector?: boolean;
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  size = 'md',
  showQuantitySelector = false,
  className,
  disabled = false,
}) => {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock || disabled) return;
    
    setIsAdding(true);
    
    try {
      addToCart(product, quantity);
      // Reset quantity after successful add
      if (showQuantitySelector) {
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      // Add slight delay for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

  const isButtonDisabled = !product.inStock || isAdding || isLoading || disabled;

  return (
    <div className="space-y-4">
      {showQuantitySelector && product.inStock && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-foreground">Quantity:</span>
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 border-x border-border min-w-[3rem] text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
              className="p-2 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.stock} available)
          </span>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "w-full relative",
          {
            "cursor-not-allowed opacity-50": !product.inStock,
            "opacity-75 cursor-wait": isAdding || isLoading,
          },
          className
        )}
        aria-label={`Add ${product.name} to cart`}
      >
        {isAdding || isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {!product.inStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </>
        )}
      </button>

      {!product.inStock && (
        <p className="text-sm text-destructive text-center">
          This item is currently out of stock
        </p>
      )}
    </div>
  );
};