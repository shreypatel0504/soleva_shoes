'use client';

import React from 'react';
import Link from 'next/link';
import { X, ChevronRight, User, Heart, ShoppingBag, ShieldCheck, Mail, MapPin, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-[#111114] border-l border-[#222228] shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-[#222228] flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center space-x-2">
            <svg viewBox="0 0 48 24" fill="currentColor" className="w-8 h-4 text-white">
              <path d="M4 18 C 14 18, 26 12, 44 2 C 34 8, 20 14, 10 14 C 7 14, 4 16, 4 18 Z" />
            </svg>
            <span className="text-xl font-black tracking-tighter text-white font-nike">
              SOLEVA
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1C1C22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-[#EDEDED]">
          <div className="space-y-1">
            {[
              { name: 'New & Featured', href: '/shop?isNewArrival=true' },
              { name: 'Men', href: '/shop?gender=men' },
              { name: 'Women', href: '/shop?gender=women' },
              { name: 'Kids', href: '/shop?gender=kids' },
              { name: 'Sale', href: '/shop?onSale=true', highlight: true },
              { name: 'SNKRS', href: '/shop?category=sneakers' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between py-3 text-lg font-bold tracking-tight border-b border-[#1C1C22] ${
                  link.highlight ? 'text-red-500' : 'text-white hover:text-neutral-300'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </Link>
            ))}
          </div>

          {/* Member Banner & Auth */}
          <div className="pt-4 border-t border-[#222228]">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-xl">
                  <p className="font-bold text-sm text-white">{user.name}</p>
                  <p className="text-xs text-neutral-400">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-neutral-300 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/account?tab=orders"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-neutral-300 hover:text-white"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-neutral-300 hover:text-white"
                >
                  <Heart className="w-4 h-4" />
                  <span>Favourites ({wishlistCount})</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2.5 py-2 text-sm font-bold text-white bg-[#1F1F26] rounded-lg px-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full text-left py-2 text-xs font-semibold text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-bold text-white">
                  Become a Soleva Member for exclusive releases and free delivery.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="btn-nike-white flex-1 text-center py-2.5 text-xs"
                  >
                    Join Us
                  </Link>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="btn-nike-dark flex-1 text-center py-2.5 text-xs"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#222228] space-y-3 text-xs text-neutral-400 font-medium">
            <Link href="/contact" onClick={onClose} className="flex items-center gap-2 hover:text-white">
              <MapPin className="w-4 h-4" /> Find a Store
            </Link>
            <Link href="/contact" onClick={onClose} className="flex items-center gap-2 hover:text-white">
              <HelpCircle className="w-4 h-4" /> Help &amp; Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
