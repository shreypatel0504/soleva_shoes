'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { items, wishlistCount } = useWishlist();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 text-[#EDEDED]">
      <div className="pb-8 border-b border-[#222228]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Favourites <span className="text-neutral-400 font-normal text-lg sm:text-xl">({wishlistCount})</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Items added to your Favourites are saved here for quick shopping and release notifications.
        </p>
      </div>

      <div className="pt-8">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">No Favourites Yet</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Tap the heart icon on any shoe to save it to your favourites list.
            </p>
            <div className="pt-2">
              <Link href="/shop" className="btn-nike-white">
                Find Your Pair
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
