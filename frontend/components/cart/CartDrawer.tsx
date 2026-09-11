'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer = () => {
  const { items, cartCount, subtotal, isCartOpen, closeCart, updateQuantity, removeFromCart } =
    useCart();
  const { toggleWishlist } = useWishlist();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 14000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111114] border-l border-[#222228] shadow-2xl flex flex-col text-[#EDEDED]">
          {/* Nike Dark Bag Header */}
          <div className="p-6 border-b border-[#1F1F24] flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Bag <span className="text-neutral-400 font-normal text-base">({cartCount})</span>
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1C1C22] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Free Delivery Meter */}
          <div className="bg-[#16161A] px-6 py-3 border-b border-[#1F1F24] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-neutral-300 mb-1.5">
                Add <span className="font-semibold text-white">{formatCurrency(remainingForFreeShipping)}</span> more for <span className="font-semibold text-white">Free Standard Delivery</span>
              </p>
            ) : (
              <p className="text-green-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <span>✓</span> You&apos;ve unlocked Free Standard Delivery!
              </p>
            )}
            <div className="w-full bg-[#24242C] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <p className="text-base font-bold text-white">There are no items in your bag.</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn-nike-white"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.name}-${item.size}-${item.color}-${idx}`} className="flex gap-4 pb-5 border-b border-[#1F1F24] last:border-0">
                  {/* Image Container on Dark Background */}
                  <div className="relative w-24 h-24 bg-[#161619] border border-[#24242A] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                        <p className="text-sm font-medium text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="text-xs text-[#8E8E93] mt-0.5">
                        Size: UK {item.size} • {item.color}
                      </p>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs text-neutral-400">
                        <span>Qty</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(idx, Number(e.target.value))}
                          className="bg-[#18181C] border border-[#28282E] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#1F1F24] space-y-4 bg-[#111114]">
              <div className="flex items-center justify-between text-base font-medium text-white">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-nike-white w-full py-3.5 text-sm font-semibold"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-nike-dark w-full py-3 text-sm font-medium text-center"
                >
                  View Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
