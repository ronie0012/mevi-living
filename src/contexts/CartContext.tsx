"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, CartContextType, Product } from '@/lib/types';
import { toast } from 'sonner';

// Cart Actions
type CartAction =
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; variantId?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Generate unique cart item ID
const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

// Cart reducer
const cartReducer = (state: Cart & { isLoading: boolean }, action: CartAction): Cart & { isLoading: boolean } => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...action.payload,
        isLoading: false,
      };

    case 'ADD_TO_CART': {
      const { product, quantity, variantId } = action.payload;
      const itemId = generateCartItemId(product.id, variantId);
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock limit
        if (newQuantity > product.stock) {
          toast.error(`Cannot add more items. Only ${product.stock} available in stock.`);
          return state;
        }
        
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        
        toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
      } else {
        // Add new item
        if (quantity > product.stock) {
          toast.error(`Cannot add ${quantity} items. Only ${product.stock} available in stock.`);
          return state;
        }
        
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          variantId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
          maxStock: product.stock,
        };
        
        updatedItems = [...state.items, newItem];
        toast.success(`${product.name} added to cart!`);
      }
      
      const totals = calculateTotals(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
        isLoading: false,
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(updatedItems);
      
      toast.success('Item removed from cart');
      
      return {
        ...state,
        items: updatedItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
        isLoading: false,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: itemId });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.id === itemId) {
          // Check stock limit
          if (quantity > item.maxStock) {
            toast.error(`Cannot update quantity. Only ${item.maxStock} available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
      
      const totals = calculateTotals(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
        isLoading: false,
      };
    }

    case 'CLEAR_CART':
      toast.success('Cart cleared');
      return {
        ...initialCart,
        isLoading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialCart,
    isLoading: true,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('mevi-cart');
          if (savedCart) {
            const parsedCart: Cart = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: parsedCart });
          } else {
            dispatch({ type: 'LOAD_CART', payload: initialCart });
          }
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        dispatch({ type: 'LOAD_CART', payload: initialCart });
      }
    };

    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading && typeof window !== 'undefined') {
      try {
        const cartToSave: Cart = {
          items: state.items,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
        };
        localStorage.setItem('mevi-cart', JSON.stringify(cartToSave));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [state]);

  // Context methods
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate async operation
    setTimeout(() => {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, variantId } });
    }, 300);
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue: CartContextType = {
    cart: {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    },
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading: state.isLoading,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};