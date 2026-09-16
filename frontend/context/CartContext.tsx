'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../lib/types';
import { cartApi } from '../lib/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: number | string, color: string, quantity?: number) => Promise<void>;
  updateQuantity: (index: number, quantity: number) => Promise<void>;
  removeFromCart: (index: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useToast();

  // Load cart from localStorage or backend
  useEffect(() => {
    if (token) {
      // Authenticated user: fetch from backend
      cartApi
        .getCart()
        .then((res) => {
          if (res.data && res.data.data && res.data.data.cart) {
            setItems(res.data.data.cart.items || []);
          }
        })
        .catch(() => {
          // Fallback to local storage
          loadLocalCart();
        });
    } else {
      loadLocalCart();
    }
  }, [token]);

  const loadLocalCart = () => {
    try {
      const saved = localStorage.getItem('soleva_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      setItems([]);
    }
  };

  const saveLocalCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('soleva_cart', JSON.stringify(newItems));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (
    product: Product,
    size: number | string,
    color: string,
    quantity: number = 1
  ) => {
    const existingIndex = items.findIndex(
      (item) =>
        (typeof item.product === 'string' ? item.product : item.product._id) === product._id &&
        item.size === size &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        product: product,
        name: product.name,
        image: product.images[0],
        size,
        color,
        quantity,
        price: product.price,
      };
      updatedItems = [...items, newItem];
    }

    saveLocalCart(updatedItems);
    setIsCartOpen(true);

    showToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.name} (Size ${size})`,
    });

    if (token) {
      try {
        const res = await cartApi.addToCart({
          productId: product._id,
          size,
          color,
          quantity,
        });
        if (res.data?.data?.cart?.items) {
          saveLocalCart(res.data.data.cart.items);
        }
      } catch (err) {
        console.error('Failed to sync item to backend cart', err);
      }
    }
  };

  const updateQuantity = async (index: number, quantity: number) => {
    if (index < 0 || index >= items.length) return;

    let updated: CartItem[];
    const item = items[index];

    if (quantity <= 0) {
      updated = items.filter((_, i) => i !== index);
    } else {
      updated = [...items];
      updated[index] = { ...updated[index], quantity };
    }

    saveLocalCart(updated);

    if (token && item._id) {
      try {
        await cartApi.updateCartItem(item._id, quantity);
      } catch (err) {
        console.error('Failed to update cart item in backend', err);
      }
    }
  };

  const removeFromCart = async (index: number) => {
    if (index < 0 || index >= items.length) return;
    const item = items[index];
    const updated = items.filter((_, i) => i !== index);

    saveLocalCart(updated);

    showToast({
      type: 'info',
      title: 'Removed from Bag',
      message: item.name,
    });

    if (token && item._id) {
      try {
        await cartApi.removeCartItem(item._id);
      } catch (err) {
        console.error('Failed to remove cart item from backend', err);
      }
    }
  };

  const clearCart = async () => {
    saveLocalCart([]);
    if (token) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error('Failed to clear cart in backend', err);
      }
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
