'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { wishlistApi } from '../lib/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  items: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (token) {
      wishlistApi
        .getWishlist()
        .then((res) => {
          if (res.data?.data?.wishlist?.products) {
            setItems(res.data.data.wishlist.products);
          }
        })
        .catch(() => loadLocalWishlist());
    } else {
      loadLocalWishlist();
    }
  }, [token]);

  const loadLocalWishlist = () => {
    try {
      const saved = localStorage.getItem('soleva_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  };

  const saveLocalWishlist = (newItems: Product[]) => {
    setItems(newItems);
    localStorage.setItem('soleva_wishlist', JSON.stringify(newItems));
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some((item) => item._id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product._id);
    let updated: Product[];

    if (exists) {
      updated = items.filter((item) => item._id !== product._id);
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: product.name,
      });
    } else {
      updated = [...items, product];
      showToast({
        type: 'success',
        title: 'Saved to Wishlist',
        message: product.name,
      });
    }

    saveLocalWishlist(updated);

    if (token) {
      try {
        await wishlistApi.toggleWishlist(product._id);
      } catch (err) {
        console.error('Failed to sync wishlist with backend', err);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const updated = items.filter((item) => item._id !== productId);
    saveLocalWishlist(updated);

    if (token) {
      try {
        await wishlistApi.removeFromWishlist(productId);
      } catch (err) {
        console.error('Failed to sync wishlist deletion with backend', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
