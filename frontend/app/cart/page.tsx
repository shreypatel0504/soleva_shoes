'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { couponApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, cartCount, subtotal, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountValue: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    try {
      const res = await couponApi.validateCoupon(couponInput.trim(), subtotal);
      if (res.data.success && res.data.data) {
        setAppliedCoupon({
          code: res.data.data.code,
          discountAmount: res.data.data.discountAmount,
          discountValue: res.data.data.discountValue,
        });
        showToast({
          type: 'success',
          title: 'Promo Code Applied!',
          message: `Saved ${formatCurrency(res.data.data.discountAmount)} with code ${res.data.data.code}`,
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Invalid Promo Code',
        message: err.response?.data?.message || 'The promo code is invalid or does not meet minimum order requirements.',
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const shippingFee = subtotal > 14000 ? 0 : subtotal > 0 ? 750 : 0;
  const grandTotal = Math.max(0, taxableAmount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 text-center space-y-4 text-[#EDEDED]">
        <h2 className="text-2xl font-bold text-white">Your Bag is empty.</h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Once you add items to your bag, they will appear here. Ready to find your pair?
        </p>
        <div className="pt-2">
          <Link href="/shop" className="btn-nike-white">
            Shop Shoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-[#EDEDED]">
      {/* Free Shipping Banner */}
      <div className="p-4 bg-[#141416] border border-[#222228] rounded-xl text-xs text-neutral-300 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p>
          <span className="font-semibold text-white">Free Delivery across India for Members.</span> Sign up or sign in for free standard delivery on orders over ₹14,000.
        </p>
        <Link href="/register" className="underline font-semibold text-white hover:text-neutral-300">
          Join Us
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* Left: Bag Items (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-2xl font-medium tracking-tight text-white">
            Bag
          </h1>

          <div className="divide-y divide-[#1F1F24] border-t border-b border-[#1F1F24]">
            {items.map((item, idx) => (
              <div key={`${item.name}-${item.size}-${item.color}-${idx}`} className="py-6 flex gap-4 sm:gap-6">
                {/* Shoe Image on Dark Background */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-[#161619] border border-[#24242A] rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info Stack */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-medium text-white">{item.name}</h3>
                      <span className="text-base font-medium text-white whitespace-nowrap">
                        MRP : {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    <p className="text-sm text-[#8E8E93]">
                      Men&apos;s / Women&apos;s Shoes
                    </p>
                    <p className="text-sm text-[#8E8E93]">
                      {item.color}
                    </p>
                    <div className="flex items-center gap-6 pt-1 text-sm text-[#8E8E93]">
                      <p>Size: <span className="text-white font-medium">UK {item.size}</span></p>
                      <div className="flex items-center gap-1.5">
                        <span>Quantity:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(idx, Number(e.target.value))}
                          className="bg-[#18181C] border border-[#2D2D35] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Favourite & Delete Icons */}
                  <div className="flex items-center space-x-4 pt-4 text-neutral-400">
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5 stroke-[1.7]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Nike Summary Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 bg-[#141416] border border-[#222228] p-6 rounded-2xl">
          <h2 className="text-2xl font-medium tracking-tight text-white">
            Summary
          </h2>

          {/* Promo Code Accordion */}
          <div className="border-b border-[#1F1F24] pb-4">
            <button
              onClick={() => setIsPromoOpen(!isPromoOpen)}
              className="w-full flex items-center justify-between text-sm font-medium text-white py-1"
            >
              <span>Do you have a Promo Code?</span>
              {isPromoOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>
            {isPromoOpen && (
              <form onSubmit={handleApplyCoupon} className="pt-3 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter Code (e.g. WELCOME10)"
                  className="flex-1 px-4 py-2.5 text-xs bg-[#18181C] border border-[#2D2D35] text-white rounded-lg focus:outline-none focus:border-white uppercase"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="btn-nike-outline text-xs px-5 py-2.5"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}
            {appliedCoupon && (
              <p className="text-xs text-green-400 font-medium mt-2 flex items-center gap-1">
                <span>✓</span> Code {appliedCoupon.code} applied (-{formatCurrency(appliedCoupon.discountAmount)})
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-sm text-neutral-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-green-400 font-medium">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Estimated Delivery &amp; Handling</span>
              <span className="font-medium text-white">
                {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Checkout Pill Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href="/checkout"
              className="btn-nike-white w-full py-4 text-sm font-semibold text-center block"
            >
              Member Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
