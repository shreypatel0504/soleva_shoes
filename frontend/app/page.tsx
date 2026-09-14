'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
  Award,
  Mail,
  ArrowRight,
  Compass,
  Layers,
  Activity,
  Star,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { productApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useToast } from '@/context/ToastContext';

// Unique Curated Iconic Franchises
const ICONIC_FRANCHISES = [
  {
    name: 'AeroCell Kinetic',
    tag: 'Supercritical Foam',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=85',
    href: '/product/aerocell-kinetic-runner',
  },
  {
    name: 'ApexLab Carbon',
    tag: '3K Carbon Plate',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=85',
    href: '/product/apexlab-hypervelocity-carbon',
  },
  {
    name: 'Veloce Monaco',
    tag: 'Calfskin Leather',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=85',
    href: '/product/veloce-monaco-minimalist',
  },
  {
    name: 'Stratos Gore-X',
    tag: 'All-Terrain Hybrid',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&auto=format&fit=crop&q=85',
    href: '/product/stratos-terra-hybrid-gore-x',
  },
  {
    name: 'Phantom Black',
    tag: 'Tactical Stealth',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=85',
    href: '/product/soleva-apex-phantom-triple-black',
  },
  {
    name: 'SwiftStride',
    tag: 'Stretch Knit Slip-On',
    image: '/products/aeropulse/swiftstride_profile.jpg',
    href: '/product/aeropulse-swiftstride-slip-on',
  },
];

// Curated Editorial Stories (Unique high-res lifestyle visuals)
const FEATURED_STORIES = [
  {
    title: 'Engineered Road Propulsion',
    subtitle: 'AeroCell Kinetic. Light as vapor, explosive as lightning with 84% energy return.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
    link: '/shop?category=running',
    btnText: 'Explore Running Lab',
    tag: 'Performance Lab',
  },
  {
    title: 'Italian Minimalist Heritage',
    subtitle: 'Handcrafted full-grain calfskin luxury sculpted for elevated urban dressing.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&auto=format&fit=crop&q=85',
    link: '/shop?category=sneakers',
    btnText: 'Shop Luxury Court',
    tag: 'Atelier Series',
  },
  {
    title: 'All-Terrain Technical Scramble',
    subtitle: 'eVent weather-sealed membrane and aggressive 5mm multidirectional Vibram lugs.',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=85',
    link: '/shop?category=sports',
    btnText: 'Shop Trail & Outdoor',
    tag: 'Backcountry Spec',
  },
];

// Curated Categories with Distinct Unique Imagery
const CATEGORY_SHOWCASE = [
  {
    name: 'Road & Marathon Running',
    category: 'running',
    desc: 'Propulsion, supercritical foam & carbon plates',
    image: '/products/showcase/road_marathon.jpg',
    tag: 'Speed Lab',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    aspect: 'aspect-[4/5] md:aspect-auto',
  },
  {
    name: 'Luxury Court Sneakers',
    category: 'sneakers',
    desc: 'Artisan court silhouettes & street luxury',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=85',
    tag: 'Editorial',
    span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
    aspect: 'aspect-[4/3] sm:aspect-square',
  },
  {
    name: 'Gym & Cross Training',
    category: 'sports',
    desc: 'Multi-directional stability & ground lockdown',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=85',
    tag: 'Conditioning',
    span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
    aspect: 'aspect-[4/3] sm:aspect-square',
  },
  {
    name: 'Italian Leather & Lifestyle',
    category: 'lifestyle',
    desc: 'Handcrafted Tuscan suede & brogues',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&auto=format&fit=crop&q=85',
    tag: 'Artisan',
    span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
    aspect: 'aspect-[4/3] sm:aspect-square',
  },
  {
    name: 'Court & Basketball',
    category: 'basketball',
    desc: 'Explosive vertical bounce & lateral chassis',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&auto=format&fit=crop&q=85',
    tag: 'Hardwood',
    span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
    aspect: 'aspect-[4/3] sm:aspect-square',
  },
];

// Press & Critics Acclaim
const PRESS_QUOTES = [
  {
    quote: "The undisputed new benchmark in high-fashion athletic engineering.",
    source: "VOGUE INDIA",
  },
  {
    quote: "Minimalist Italian silhouette seamlessly merged with race-day carbon technology.",
    source: "GQ MAGAZINE",
  },
  {
    quote: "The most explosive energy-return foam tested in our footwear labs this year.",
    source: "RUNNER'S WORLD",
  },
  {
    quote: "SOLEVA proves luxury footwear can outperform dedicated track marathoners.",
    source: "HIGHSNOBIETY",
  },
];

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotified, setIsNotified] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
      });
      return;
    }
    setNewsletterSuccess(true);
    showToast({
      type: 'success',
      title: 'VIP Club Unlocked',
      message: 'Welcome to SOLEVA VIP Club! Promo code WELCOME10 unlocked.',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [arrivalsRes, trendingRes] = await Promise.allSettled([
          productApi.getProducts({ isNewArrival: 'true', limit: 8 }),
          productApi.getProducts({ sort: 'popular', limit: 8 }),
        ]);

        if (arrivalsRes.status === 'fulfilled' && arrivalsRes.value.data?.data?.products) {
          setNewArrivals(arrivalsRes.value.data.data.products);
        }
        if (trendingRes.status === 'fulfilled' && trendingRes.value.data?.data?.products) {
          setTrendingProducts(trendingRes.value.data.data.products);
        }
      } catch (err) {
        console.error('Home page data fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNotifyDrop = () => {
    setIsNotified(true);
    showToast({
      type: 'success',
      title: 'Drop Alert Configured',
      message: 'You will receive an instant WhatsApp & SMS priority alert 15 minutes before the Quantum Warp drop!',
    });
  };

  return (
    <div className="space-y-16 sm:space-y-28 pb-24 text-[#EDEDED]">
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 sm:pt-4">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0C0C10] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {/* Hero Photography Container */}
          <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] w-full">
            <Image
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=2400&auto=format&fit=crop&q=90"
              alt="SOLEVA Luxury Footwear Craftsmanship"
              fill
              priority
              className="object-cover object-center brightness-75 contrast-110"
            />
            
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08080A]/80 via-transparent to-[#08080A]/80 hidden md:block" />

            {/* Top Live Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white uppercase tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                <span>Season 2026 Edition 01 • Available Across India</span>
              </div>
            </div>

            {/* Hero Text & CTA Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-16 z-10 max-w-4xl">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#CCFF00] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Apex of Luxury Athletic Footwear</span>
                </p>

                <h1 className="font-nike text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white leading-[0.92] text-gradient-silver">
                  ENGINEERED FOR MOTION.<br />
                  <span className="text-white">REFINED FOR LIFE.</span>
                </h1>

                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Supercritical 84% energy-return foam. 3K spoon-curved carbon torsion plate. Sculpted with Italian calfskin and built to propel your stride forward with relentless momentum.
                </p>

                <div className="pt-3 sm:pt-5 flex flex-wrap items-center gap-3.5">
                  <Link href="/shop?category=running" className="btn-nike-white">
                    Explore Running Lab
                  </Link>
                  <Link href="/shop?isNewArrival=true" className="btn-nike-black">
                    Shop New Releases
                  </Link>
                  <Link href="/shop" className="btn-nike-outline">
                    View Entire Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Luxury Tech Highlights Bar */}
          <div className="border-t border-white/[0.08] bg-[#0E0E14]/90 backdrop-blur-xl py-3.5 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">84% Rebound</span>
                <span className="text-[10px] text-neutral-400">Supercritical Nitrogen</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">3K Carbon Plate</span>
                <span className="text-[10px] text-neutral-400">Spoon-Curved Propulsion</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Italian Calfskin</span>
                <span className="text-[10px] text-neutral-400">Hand-Burnished Atelier</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Vibram Megagrip</span>
                <span className="text-[10px] text-neutral-400">All-Weather Siped Tread</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATHLETE SOCIAL PROOF & CREDIBILITY TICKER */}
      <section className="border-y border-white/[0.08] bg-[#0C0C10]/80 backdrop-blur-md py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#08080A] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Verified Athlete"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#08080A] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Verified Athlete"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#08080A] object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="Verified Athlete"
              />
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1C24] ring-2 ring-[#08080A] text-[10px] font-bold text-[#CCFF00]">
                +14k
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <span>4.9 / 5.0 Rating</span>
              </div>
              <p className="text-[11px] text-neutral-400">Chosen by 14,000+ Marathoners, Athletes & Collectors</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Carbon Plate Certified</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Same-Day Dispatch in Bengaluru & Mumbai</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>30-Day Wear-Test Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ALWAYS ICONIC — FRANCHISE STRIP */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Always Iconic
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Explore our most celebrated silhouettes and proprietary innovations.</p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>View All Franchises</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div
          ref={iconsRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {ICONIC_FRANCHISES.map((franchise) => (
            <Link
              key={franchise.name}
              href={franchise.href}
              className="group min-w-[210px] sm:min-w-[240px] p-3 rounded-2xl bg-[#111115] border border-white/[0.06] hover:border-white/30 hover:bg-[#16161C] transition-all flex items-center gap-3.5 flex-shrink-0 shadow-sm"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#18181E] flex-shrink-0 border border-white/[0.08]">
                <Image
                  src={franchise.image}
                  alt={franchise.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#CCFF00] transition-colors">
                  {franchise.name}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {franchise.tag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. THE LATEST & GREATEST — PRODUCT CAROUSEL */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]"></span>
              <span className="text-[11px] uppercase tracking-widest text-[#CCFF00] font-bold">New Releases</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              The Latest &amp; Greatest
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 rounded-full bg-[#131317] hover:bg-[#1F1F26] text-white border border-white/10 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-10 h-10 rounded-full bg-[#131317] hover:bg-[#1F1F26] text-white border border-white/10 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroller */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 animate-pulse">
                <div className="aspect-[4/4.2] bg-[#141418] rounded-xl" />
                <div className="h-4 bg-[#141418] rounded mt-3 w-1/3" />
                <div className="h-5 bg-[#141418] rounded mt-2 w-3/4" />
                <div className="h-4 bg-[#141418] rounded mt-2 w-1/2" />
              </div>
            ))
          ) : newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <div
                key={product._id}
                className="min-w-[280px] sm:min-w-[320px] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm py-8">Loading fresh drops...</p>
          )}
        </div>
      </section>

      {/* 4. CURATED CATEGORY BENTO GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              Curated Disciplines
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Footwear engineered specifically for your pursuit.</p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Explore All (24 Models)
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORY_SHOWCASE.map((item) => (
            <Link
              key={item.name}
              href={`/shop?category=${item.category}`}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] hover:border-white/30 transition-all ${item.span} ${item.aspect} bg-[#111115]`}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-2.5 py-1 rounded-full shadow">
                  {item.tag}
                </span>
              </div>

              {/* Text Info */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 space-y-1">
                <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  {item.desc}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-white group-hover:underline">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SECOND HERO PROMO: "FEEL THE UNREAL" */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative w-full aspect-[16/9] sm:aspect-[24/9] overflow-hidden bg-[#0F0F13] border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=2400&auto=format&fit=crop&q=90"
            alt="ApexLab HyperVelocity Carbon Marathon"
            fill
            className="object-cover object-center brightness-75 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/95 via-black/60 to-transparent flex items-center">
            <div className="p-6 sm:p-12 lg:p-16 max-w-xl text-white space-y-3 sm:space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-[#FF5722] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Race-Day Breakthrough</span>
              </p>
              <h2 className="font-nike text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] text-gradient-silver">
                FEEL THE UNREAL.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                Ultralight kinetic pods return 84% of impact force. Spoon-curved full-length 3K carbon plate calibrated for sub-4:00/km race pace.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/product/apexlab-hypervelocity-carbon"
                  className="btn-nike-white text-xs"
                >
                  Shop HyperVelocity (₹22,495)
                </Link>
                <Link
                  href="/shop?category=running"
                  className="btn-nike-outline text-xs"
                >
                  Explore Speed Lab
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED 3-COLUMN LIFESTYLE EDITORIAL GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-6">
          Featured Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_STORIES.map((story) => (
            <div key={story.title} className="group relative flex flex-col rounded-2xl bg-[#0F0F13] border border-white/[0.06] hover:border-white/20 transition-all p-3">
              {/* Image Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#16161C] rounded-xl">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  {story.tag}
                </div>
              </div>

              {/* Text & Action */}
              <div className="pt-4 px-1 space-y-2 flex flex-col flex-1 justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#CCFF00] transition-colors">{story.title}</h3>
                  <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                    {story.subtitle}
                  </p>
                </div>
                <div className="pt-3">
                  <Link href={story.link} className="btn-nike-white text-xs w-full sm:w-auto">
                    {story.btnText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LIMITED SNKRS HEAT LAUNCH DROP COUNTDOWN */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-gradient-to-r from-[#121216] via-[#1A1A22] to-[#0F0F13] border border-white/[0.1] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-2.5 py-0.5 rounded-full shadow">
                  SNKRS Limited Drop
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Friday 10:00 AM IST • Strict Allocation
                </span>
              </div>
              
              <h2 className="font-nike text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                APEXLAB QUANTUM WARP TECH
              </h2>
              
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
                Avant-garde parametric open-lattice 3D printed heel unit. Only 50 individually numbered pairs allocated for Indian release with personalized serial engraving.
              </p>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Release Price</span>
                  <span className="text-xl sm:text-2xl font-bold text-white">₹23,995</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Launch Stock</span>
                  <span className="text-sm font-bold text-[#CCFF00]">50 Pairs Only</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleNotifyDrop}
                  disabled={isNotified}
                  className="btn-nike-white text-xs flex items-center gap-2"
                >
                  {isNotified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Alert Configured (SMS &amp; WhatsApp)</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Notify Me on Drop</span>
                    </>
                  )}
                </button>
                <Link
                  href="/product/apexlab-quantum-warp-tech"
                  className="btn-nike-outline text-xs"
                >
                  View Details &amp; Specs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#14141A] border border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1562183241-b937e95585b6?w=1200&auto=format&fit=crop&q=90"
                  alt="Quantum Warp Tech 3D Printed Heel"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRENDING SHOES SPOTLIGHT (4-Column Grid) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              Trending Footwear
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Most favored silhouettes this week across India.</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors hover:underline"
          >
            Shop All (24 Models)
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. PROPRIETARY INNOVATION LABORATORY */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-[#111116] to-[#0A0A0E]">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#CCFF00] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Proprietary Footwear Engineering</span>
            </p>
            <h2 className="font-nike text-3xl sm:text-5xl tracking-tight text-white mt-1">
              THE SCIENCE OF SPEED.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-normal">
              Every SOLEVA silhouette is prototyped and mechanical-stress tested in our Bengaluru biomechanics lab.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-[#14141A]/70 border border-white/[0.06] hover:border-white/20 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-[#CCFF00]" />
              </div>
              <h3 className="text-sm font-bold text-white">Supercritical Nitrogen Matrix</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Superheated nitrogen gas infused at high pressure produces ultra-dense micro-cells with 84% rebound resilience.
              </p>
              <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                Metric: 230g Weight • 8mm Drop
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141A]/70 border border-white/[0.06] hover:border-white/20 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-sm font-bold text-white">3K Spoon Carbon Plate</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Aerospace-grade woven carbon fiber plate shaped with aggressive spoon curvature for maximum toe-off propulsion.
              </p>
              <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                Pace Target: Sub-4:00/km Marathon
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141A]/70 border border-white/[0.06] hover:border-white/20 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Italian Calfskin Atelier</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Supple full-grain leather sourced from Tuscan tanneries, hand-stitched by multi-generational cobblers.
              </p>
              <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                Grade: 1.2mm Micro-Calfskin
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141A]/70 border border-white/[0.06] hover:border-white/20 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Vibram Megagrip Traction</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Multi-directional 5mm directional siped lugs calibrated for wet pavement, monsoon tarmac, and mountain shale.
              </p>
              <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                Friction Coeff: 0.82 Wet Rubber
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CRITICS & PRESS ACCLAIM TICKER */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Global Press Recognition</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESS_QUOTES.map((item) => (
            <div
              key={item.source}
              className="p-5 rounded-2xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between space-y-3"
            >
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                "{item.quote}"
              </p>
              <span className="text-[11px] font-bold text-white tracking-widest uppercase border-t border-white/5 pt-2">
                — {item.source}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 11. VIP MEMBERSHIP & SECRET DROPS NEWSLETTER */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#121216] via-[#171720] to-[#101014] p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Private Access Club</span>
            </div>
            <h2 className="font-nike text-3xl sm:text-5xl tracking-tight text-white">
              BE FIRST ON THE NEXT DROP.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
              Subscribe to the SOLEVA India insider dispatch. Get instant drop SMS alerts, private colorway invitations, and an immediate <span className="text-white font-semibold">10% discount promo code</span> on your first order.
            </p>

            {newsletterSuccess ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>You are on the VIP Drop List! Use code <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">WELCOME10</strong> at checkout for 10% off.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email for private drop invites..."
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0C0C10] border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <button type="submit" className="btn-nike-white text-xs whitespace-nowrap">
                  Unlock 10% Off
                </button>
              </form>
            )}

            <p className="text-[11px] text-neutral-400">
              Zero spam. Unsubscribe anytime with one tap. Protected by Indian data privacy norms.
            </p>
          </div>
        </div>
      </section>

      {/* 12. SOLEVA MEMBERSHIP INDIA ACCORD */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-gradient-to-br from-[#121216] via-[#16161E] to-[#0E0E12] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-8 sm:p-14 text-center space-y-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            Soleva Membership India
          </p>
          <h2 className="font-nike text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-none">
            BECOME A MEMBER
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-normal">
            Join the elite athletic collective. Free to join, unlocking priority drops, pan-India free expedited delivery, and birthday privileges.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-4 rounded-xl bg-[#14141A]/70 border border-white/[0.06]">
              <span className="text-lg">🚚</span>
              <h4 className="text-xs font-bold text-white mt-1">Free Expedited Delivery</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Complimentary express shipping across all Indian PIN codes.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#14141A]/70 border border-white/[0.06]">
              <span className="text-lg">👟</span>
              <h4 className="text-xs font-bold text-white mt-1">Member Exclusives</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Early access to high-heat SNKRS releases and limited colorways.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#14141A]/70 border border-white/[0.06]">
              <span className="text-lg">🎁</span>
              <h4 className="text-xs font-bold text-white mt-1">Birthday Perks</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Special 20% privilege promo code every year during your birthday month.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/register" className="btn-nike-white">
              Join Us (Free)
            </Link>
            <Link href="/login" className="btn-nike-black">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
