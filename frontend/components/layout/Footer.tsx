'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#111111] text-[#7E7E7E] text-xs pt-12 sm:pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Top Section: Navigation Columns & Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#222222]">
          {/* Column 1: Primary Bold Links */}
          <div className="space-y-3 font-nike tracking-wider text-white text-sm">
            <p><Link href="/contact" className="hover:text-neutral-300">FIND A STORE</Link></p>
            <p><Link href="/register" className="hover:text-neutral-300">BECOME A MEMBER</Link></p>
            <p><Link href="/contact" className="hover:text-neutral-300">SIGN UP FOR EMAIL</Link></p>
            <p><Link href="/contact" className="hover:text-neutral-300">SEND US FEEDBACK</Link></p>
            <p><Link href="/shop?onSale=true" className="hover:text-neutral-300">STUDENT DISCOUNTS</Link></p>
          </div>

          {/* Column 2: Get Help */}
          <div className="space-y-2.5">
            <h4 className="font-nike tracking-wider text-white text-xs mb-3">GET HELP</h4>
            <p><Link href="/account?tab=orders" className="hover:text-white transition-colors">Order Status</Link></p>
            <p><Link href="/shipping-policy" className="hover:text-white transition-colors">Delivery & Shipping</Link></p>
            <p><Link href="/refund-policy" className="hover:text-white transition-colors">Returns & Refunds</Link></p>
            <p><Link href="/contact" className="hover:text-white transition-colors">Payment Options</Link></p>
            <p><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></p>
          </div>

          {/* Column 3: About Soleva */}
          <div className="space-y-2.5">
            <h4 className="font-nike tracking-wider text-white text-xs mb-3">ABOUT SOLEVA</h4>
            <p><Link href="/about" className="hover:text-white transition-colors">Our Brand Story</Link></p>
            <p><Link href="/about" className="hover:text-white transition-colors">Bengaluru Innovation Lab</Link></p>
            <p><Link href="/about" className="hover:text-white transition-colors">Sustainability &amp; Materials</Link></p>
            <p><Link href="/contact" className="hover:text-white transition-colors">Careers &amp; Ateliers</Link></p>
            <p><Link href="/shop" className="hover:text-white transition-colors">Soleva Athletics</Link></p>
          </div>

          {/* Column 4: Quick Shop */}
          <div className="space-y-2.5">
            <h4 className="font-nike tracking-wider text-white text-xs mb-3">SHOP BY CATEGORY</h4>
            <p><Link href="/shop?gender=men" className="hover:text-white transition-colors">Men&apos;s Shoes</Link></p>
            <p><Link href="/shop?gender=women" className="hover:text-white transition-colors">Women&apos;s Shoes</Link></p>
            <p><Link href="/shop?category=running" className="hover:text-white transition-colors">Running Shoes</Link></p>
            <p><Link href="/shop?category=sneakers" className="hover:text-white transition-colors">Sneakers &amp; Street</Link></p>
            <p><Link href="/shop?onSale=true" className="hover:text-white transition-colors">Sale Collection</Link></p>
          </div>

          {/* Column 5: Social Media Icons (Nike circular dark buttons) */}
          <div className="flex md:justify-end items-start space-x-3 pt-2 md:pt-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#7E7E7E] hover:bg-white text-[#111111] flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 fill-current" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#7E7E7E] hover:bg-white text-[#111111] flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 fill-current" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#7E7E7E] hover:bg-white text-[#111111] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 fill-current" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#7E7E7E] hover:bg-white text-[#111111] flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>

        {/* Bottom Section: Location & Legal Links */}
        <div className="pt-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center space-x-3 text-white">
            <div className="flex items-center space-x-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 fill-white" />
              <span>India</span>
            </div>
            <span className="text-[#7E7E7E]">
              &copy; {new Date().getFullYear()} SOLEVA, Inc. All Rights Reserved
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#7E7E7E]">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Guides
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Sale
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Soleva Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
