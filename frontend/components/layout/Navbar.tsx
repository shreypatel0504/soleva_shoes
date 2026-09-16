'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Menu,
  ShieldCheck,
  LogOut,
  Package,
  MapPin,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SearchBarModal } from '../ui/SearchBarModal';
import { MobileNavDrawer } from './MobileNavDrawer';

interface MegaMenuColumn {
  title: string;
  links: { name: string; href: string; badge?: string }[];
}

const MEGA_MENUS: Record<string, MegaMenuColumn[]> = {
  'New & Featured': [
    {
      title: 'Featured',
      links: [
        { name: 'Shop All New Arrivals', href: '/shop?isNewArrival=true', badge: 'New' },
        { name: 'Best Sellers', href: '/shop?sort=popular', badge: 'Hot' },
        { name: 'Member Exclusive Drops', href: '/shop' },
        { name: 'SNKRS Heat Launch Calendar', href: '/shop?category=sneakers' },
        { name: 'Latest Technology Guide', href: '/shop' },
      ],
    },
    {
      title: 'Iconic Silhouettes',
      links: [
        { name: 'AeroCell Kinetic Runner', href: '/product/aerocell-kinetic-runner' },
        { name: 'ApexLab HyperVelocity Carbon', href: '/product/apexlab-hypervelocity-carbon' },
        { name: 'Veloce Monaco Minimalist', href: '/product/veloce-monaco-minimalist' },
        { name: 'Stratos Terra Hybrid Gore-X', href: '/product/stratos-terra-hybrid-gore-x' },
        { name: 'SOLEVA Apex Phantom Black', href: '/product/soleva-apex-phantom-triple-black' },
      ],
    },
    {
      title: 'Shop by Sport',
      links: [
        { name: 'Road & Marathon Running', href: '/shop?category=running' },
        { name: 'Court & Basketball', href: '/shop?category=basketball' },
        { name: 'Gym & Cross Training', href: '/shop?category=sports' },
        { name: 'Lifestyle & Urban Street', href: '/shop?category=sneakers' },
      ],
    },
    {
      title: 'Trending Innovations',
      links: [
        { name: 'Supercritical Nitrogen Foam', href: '/shop?category=running' },
        { name: 'Spoon-Curved 3K Carbon Plate', href: '/shop?category=running' },
        { name: 'Italian Full-Grain Calfskin', href: '/shop?category=lifestyle' },
        { name: 'All-Terrain Vibram Megagrip', href: '/shop?category=sports' },
      ],
    },
  ],
  'Men': [
    {
      title: "Featured Men's",
      links: [
        { name: "All Men's Shoes", href: '/shop?gender=men' },
        { name: 'New Releases for Men', href: '/shop?gender=men&isNewArrival=true', badge: 'New' },
        { name: "Men's Best Sellers", href: '/shop?gender=men&sort=popular' },
        { name: "Men's Sale Shoes", href: '/shop?gender=men&onSale=true', badge: 'Sale' },
      ],
    },
    {
      title: 'Shoes by Category',
      links: [
        { name: 'Running Shoes', href: '/shop?gender=men&category=running' },
        { name: 'Sneakers & Streetwear', href: '/shop?gender=men&category=sneakers' },
        { name: 'Basketball High-Tops', href: '/shop?gender=men&category=basketball' },
        { name: 'Gym & Cross Trainers', href: '/shop?gender=men&category=sports' },
        { name: 'Leather Loafers & Drivers', href: '/shop?gender=men&category=lifestyle' },
      ],
    },
    {
      title: 'Shop By Price (INR)',
      links: [
        { name: 'Under ₹10,000', href: '/shop?gender=men&maxPrice=10000' },
        { name: '₹10,000 - ₹15,000', href: '/shop?gender=men&minPrice=10000&maxPrice=15000' },
        { name: '₹15,000 - ₹20,000', href: '/shop?gender=men&minPrice=15000&maxPrice=20000' },
        { name: 'Over ₹20,000', href: '/shop?gender=men&minPrice=20000' },
      ],
    },
    {
      title: 'Franchises',
      links: [
        { name: 'SOLEVA Core Series', href: '/shop?brand=soleva-core' },
        { name: 'ApexLab Racing Innovations', href: '/shop?brand=apexlab' },
        { name: 'Veloce Luxury Heritage', href: '/shop?brand=veloce' },
        { name: 'Stratos All-Terrain', href: '/shop?brand=stratos' },
      ],
    },
  ],
  'Women': [
    {
      title: "Featured Women's",
      links: [
        { name: "All Women's Shoes", href: '/shop?gender=women' },
        { name: 'New Releases for Women', href: '/shop?gender=women&isNewArrival=true', badge: 'New' },
        { name: "Women's Best Sellers", href: '/shop?gender=women&sort=popular' },
        { name: "Women's Sale Shoes", href: '/shop?gender=women&onSale=true', badge: 'Sale' },
      ],
    },
    {
      title: 'Shoes by Category',
      links: [
        { name: 'Max-Cushion Road Running', href: '/shop?gender=women&category=running' },
        { name: 'Studio & HIIT Flow Trainers', href: '/shop?gender=women&category=sports' },
        { name: 'Stretch-Knit Slip-On Shoes', href: '/shop?gender=women&category=casual' },
        { name: 'Everyday Lifestyle Sneakers', href: '/shop?gender=women&category=sneakers' },
      ],
    },
    {
      title: 'Signature Collections',
      links: [
        { name: 'CloudBurst Max Endurance', href: '/product/aeropulse-cloudburst-endurance' },
        { name: 'SwiftStride Slip-On Series', href: '/product/aeropulse-swiftstride-slip-on' },
        { name: 'Studio Flow Contoured Trainer', href: '/product/aeropulse-studio-flow-trainer' },
        { name: 'FreeSpirit Anatomical Knit', href: '/product/aeropulse-freespirit-flex-knit' },
      ],
    },
    {
      title: 'Shop By Price (INR)',
      links: [
        { name: 'Under ₹10,000', href: '/shop?gender=women&maxPrice=10000' },
        { name: '₹10,000 - ₹15,000', href: '/shop?gender=women&minPrice=10000&maxPrice=15000' },
        { name: 'Over ₹15,000', href: '/shop?gender=women&minPrice=15000' },
      ],
    },
  ],
  'Clothing': [
    {
      title: 'Shop by Category',
      links: [
        { name: 'All Clothing & Apparel', href: '/shop?department=clothing', badge: 'New Line' },
        { name: 'Jackets & Windrunners', href: '/shop?department=clothing&category=jackets' },
        { name: 'Hoodies & Sweatshirts', href: '/shop?department=clothing&category=hoodies' },
        { name: 'Performance T-Shirts', href: '/shop?department=clothing&category=t-shirts' },
        { name: 'Cargo Pants & Joggers', href: '/shop?department=clothing&category=pants' },
        { name: 'Luxury Tracksuits', href: '/shop?department=clothing&category=tracksuits' },
      ],
    },
    {
      title: 'Iconic Apparel Drops',
      links: [
        { name: 'AeroTech Storm Windrunner', href: '/product/aerotech-storm-windrunner', badge: 'Hero' },
        { name: 'ThermoKnit 480GSM Hoodie', href: '/product/thermoknit-heavyweight-hoodie', badge: 'Popular' },
        { name: 'Milano Heritage Tracksuit', href: '/product/milano-heritage-luxury-track-jacket' },
        { name: 'Apex Technical Cargo Pants', href: '/product/apex-technical-cargo-pants' },
        { name: 'Velocity Seamless Training Tee', href: '/product/velocity-seamless-training-tee' },
      ],
    },
    {
      title: 'Activity & Use',
      links: [
        { name: 'All-Weather Outerwear', href: '/shop?department=clothing&category=jackets' },
        { name: 'High-Cadence Training Tops', href: '/shop?department=clothing&category=t-shirts' },
        { name: 'Muscle-Support Compression', href: '/shop?department=clothing&category=pants' },
        { name: 'Luxury Loungewear', href: '/shop?department=clothing&category=hoodies' },
      ],
    },
    {
      title: 'Apparel Innovations',
      links: [
        { name: '2.5-Layer Storm DWR Ripstop', href: '/product/aerotech-storm-windrunner' },
        { name: 'Custom-Milled 480 GSM French Terry', href: '/product/thermoknit-heavyweight-hoodie' },
        { name: '3D Circular Seamless Anti-Odor Knit', href: '/product/velocity-seamless-training-tee' },
        { name: 'Italian Double-Knit Tricot', href: '/product/milano-heritage-luxury-track-jacket' },
      ],
    },
  ],
  'Kids': [
    {
      title: "Featured Kids'",
      links: [
        { name: "All Kids' Footwear", href: '/shop?gender=kids' },
        { name: 'Junior Performance Shoes', href: '/shop?gender=kids' },
        { name: 'Easy-Strap Playground Sneakers', href: '/shop?gender=kids' },
      ],
    },
    {
      title: 'Ages',
      links: [
        { name: 'Younger Kids (UK 3 - 5.5)', href: '/shop?gender=kids' },
        { name: 'Older Kids (UK 6 - 7.5)', href: '/shop?gender=kids' },
      ],
    },
    {
      title: 'Top Models',
      links: [
        { name: 'SkyHop Junior Spark (Electric Cobalt)', href: '/product/soleva-skyhop-junior-spark' },
      ],
    },
  ],
  'Sale': [
    {
      title: 'Featured Discounts',
      links: [
        { name: 'Shop All Sale Footwear', href: '/shop?onSale=true', badge: 'Up to 30%' },
        { name: 'Best Sellers on Sale', href: '/shop?onSale=true&sort=popular' },
        { name: 'Last Sizes Available', href: '/shop?onSale=true' },
      ],
    },
    {
      title: "Men's Sale",
      links: [
        { name: "Men's Running Shoes Sale", href: '/shop?gender=men&onSale=true' },
        { name: "Men's Lifestyle Sneakers Sale", href: '/shop?gender=men&onSale=true' },
      ],
    },
    {
      title: "Women's Sale",
      links: [
        { name: "Women's Distance Running Sale", href: '/shop?gender=women&onSale=true' },
        { name: "Women's Studio Trainers Sale", href: '/shop?gender=women&onSale=true' },
      ],
    },
    {
      title: 'Promotional Codes',
      links: [
        { name: 'WELCOME10 (10% Off First Order)', href: '/shop' },
        { name: 'SOLEVA20 (20% Off Orders over ₹9,999)', href: '/shop' },
        { name: 'FLASH50 (₹1,500 Off VIP Orders)', href: '/shop' },
      ],
    },
  ],
};

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setActiveMegaMenu(null);
  }, [pathname]);

  const handleNavMouseEnter = (linkName: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    if (MEGA_MENUS[linkName]) {
      setActiveMegaMenu(linkName);
    } else {
      setActiveMegaMenu(null);
    }
  };

  const handleNavMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
  };

  const navLinks = [
    { name: 'New & Featured', href: '/shop?isNewArrival=true' },
    { name: 'Men', href: '/shop?gender=men' },
    { name: 'Women', href: '/shop?gender=women' },
    { name: 'Clothing', href: '/shop?department=clothing' },
    { name: 'Kids', href: '/shop?gender=kids' },
    { name: 'Sale', href: '/shop?onSale=true', highlight: true },
    { name: 'SNKRS', href: '/shop?category=sneakers' },
  ];

  return (
    <>
      {/* 1. NIKE DARK TOP UTILITY BAR */}
      <div className="bg-[#08080A] text-[#8E8E93] text-[11px] font-medium border-b border-[#18181C] hidden md:block select-none">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-9 flex items-center justify-between">
          {/* Sub-brand marks */}
          <div className="flex items-center space-x-5">
            <Link href="/" className="font-extrabold tracking-wider text-white hover:text-neutral-300 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
              <span>SOLEVA LAB</span>
            </Link>
            <span className="text-neutral-700">|</span>
            <Link href="/shop" className="tracking-wider text-neutral-400 hover:text-white transition-colors">
              ATHLETICS
            </Link>
          </div>

          {/* Right utility links */}
          <div className="flex items-center space-x-3 text-neutral-400">
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-500" />
              <span>Find a Store</span>
            </Link>
            <span className="text-neutral-700">|</span>
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-neutral-500" />
              <span>Help</span>
            </Link>
            <span className="text-neutral-700">|</span>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="font-semibold text-white hover:underline flex items-center gap-1.5"
                >
                  <span>Hi, {user.name.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#141416] shadow-2xl border border-[#24242A] py-2 z-50 rounded-xl animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#24242A]">
                      <p className="font-bold text-white text-xs truncate">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-[#1E1E22] hover:text-white transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-[#1E1E22] hover:text-white transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-[#1E1E22] hover:text-white transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Favourites ({wishlistCount})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1F1F24] hover:bg-[#282830] border-t border-[#24242A] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        <span>Admin Portal</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 text-left border-t border-[#24242A] mt-1 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/register" className="hover:text-white font-medium transition-colors">
                  Join Us
                </Link>
                <span className="text-neutral-700">|</span>
                <Link href="/login" className="hover:text-white font-semibold transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. LUXURY MAIN NAVIGATION BAR */}
      <header
        className="sticky top-0 z-40 w-full bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all"
        onMouseLeave={handleNavMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[68px] flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white hover:bg-[#18181C] rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Nike-Style Bold Minimalist Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <svg
                viewBox="0 0 48 24"
                fill="currentColor"
                className="w-10 h-6 sm:w-12 sm:h-7 text-white group-hover:scale-105 transition-transform"
              >
                <path d="M4 18 C 14 18, 26 12, 44 2 C 34 8, 20 14, 10 14 C 7 14, 4 16, 4 18 Z" />
              </svg>
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-nike">
                SOLEVA
              </span>
            </Link>
          </div>

          {/* Center: Clean Nike Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isMenuHovered = activeMegaMenu === link.name;
              return (
                <div
                  key={link.name}
                  onMouseEnter={() => handleNavMouseEnter(link.name)}
                  className="h-full flex items-center"
                >
                  <Link
                    href={link.href}
                    className={`text-[15px] font-medium tracking-tight transition-colors relative py-1 ${
                      isActive || isMenuHovered
                        ? 'text-white font-semibold'
                        : 'text-neutral-300 hover:text-white'
                    } ${link.highlight ? 'text-red-500 hover:text-red-400 font-semibold' : ''}`}
                  >
                    <span>{link.name}</span>
                    {(isActive || isMenuHovered) && (
                      <span className="absolute bottom-[-22px] left-0 w-full h-[2px] bg-white rounded-full transition-all" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right: Nike Search Input Pill, Favourites, Bag */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Nike Dark Search Pill Input */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="relative hidden sm:flex items-center bg-[#18181C] hover:bg-[#202026] border border-[#28282E] rounded-full px-4 py-2 text-sm text-neutral-400 cursor-pointer transition-colors w-44 lg:w-48"
            >
              <Search className="w-4 h-4 mr-2.5 text-neutral-400 flex-shrink-0" />
              <span className="text-neutral-400 select-none text-xs">Search</span>
            </div>

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-white hover:bg-[#18181C] rounded-full transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Favourites Button */}
            <Link
              href="/wishlist"
              className="relative p-2 text-white hover:bg-[#18181C] rounded-full transition-colors"
              title="Favourites"
            >
              <Heart className="w-6 h-6 stroke-[1.7]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:bg-[#18181C] rounded-full transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.7]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. NIKE SIGNATURE MEGA MENU FLYOUT (DESKTOP) */}
        {activeMegaMenu && MEGA_MENUS[activeMegaMenu] && (
          <div
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            className="hidden lg:block absolute top-[68px] left-0 w-full bg-[#0C0C0E]/98 backdrop-blur-2xl border-b border-[#24242C] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-8">
              <div className="grid grid-cols-4 gap-8">
                {MEGA_MENUS[activeMegaMenu].map((column, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-sm font-bold tracking-tight text-white uppercase font-nike">
                      {column.title}
                    </h4>
                    <ul className="space-y-2.5 text-xs text-neutral-400">
                      {column.links.map((subLink, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            href={subLink.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="hover:text-white transition-colors flex items-center justify-between group py-0.5"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">
                              {subLink.name}
                            </span>
                            {subLink.badge && (
                              <span className="text-[10px] bg-[#222228] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">
                                {subLink.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mega Menu Bottom Bar */}
              <div className="mt-8 pt-4 border-t border-[#1C1C22] flex items-center justify-between text-xs text-neutral-400">
                <span className="text-neutral-500">
                  Explore full {activeMegaMenu} collection across all Indian pin codes.
                </span>
                <Link
                  href={navLinks.find((l) => l.name === activeMegaMenu)?.href || '/shop'}
                  onClick={() => setActiveMegaMenu(null)}
                  className="font-bold text-white hover:underline flex items-center gap-1"
                >
                  <span>View All {activeMegaMenu}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed Backdrop when Mega Menu is Open */}
      {activeMegaMenu && (
        <div
          className="hidden lg:block fixed inset-0 top-[104px] bg-black/60 backdrop-blur-sm z-30 pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Global Modals & Drawers */}
      <SearchBarModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => {
          setIsMobileMenuOpen(false);
          setIsSearchOpen(true);
        }}
      />
    </>
  );
};
