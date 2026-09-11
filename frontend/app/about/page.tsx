import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Globe2,
  ArrowRight,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SOLEVA India — Biomechanics, Craft & The Philosophy of Velocity',
  description:
    'Discover the story behind SOLEVA India. Founded in Bengaluru, combining supercritical foam physics with Italian leathercraft to engineer the next generation of performance footwear.',
  alternates: {
    canonical: 'https://soleva.in/about',
  },
  openGraph: {
    title: 'About SOLEVA India | Engineered Velocity & Luxury Footwear',
    description:
      'Explore our Bengaluru Biomechanics Lab, artisanal material sourcing, and zero-compromise athletic footwear philosophy.',
    url: 'https://soleva.in/about',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&auto=format&fit=crop&q=85',
        width: 1200,
        height: 630,
        alt: 'About SOLEVA India Atelier',
      },
    ],
  },
};

const jsonLdAboutBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://soleva.in',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About SOLEVA',
      item: 'https://soleva.in/about',
    },
  ],
};

const PILLARS = [
  {
    icon: Zap,
    title: 'Bengaluru Biomechanics Lab',
    desc: 'Every prototype undergoes high-speed force plate analysis and continuous 1,000km mechanical stress simulation to ensure structural integrity across Indian pavements.',
    tag: 'Engineering',
  },
  {
    icon: Award,
    title: 'Tuscan & Porto Leathercraft',
    desc: 'We source full-grain 1.2mm calfskin from gold-certified Italian tanneries, hand-lasted by multi-generational artisans who understand natural foot anatomy.',
    tag: 'Craftsmanship',
  },
  {
    icon: Sparkles,
    title: 'Supercritical Nitrogen Physics',
    desc: 'Proprietary AeroCell matrix foams are inflated using inert nitrogen under high pressure, yielding an industry-topping 84% energy rebound with zero pack-down.',
    tag: 'Materials Science',
  },
  {
    icon: Globe2,
    title: '100% Circular Commitment',
    desc: 'Every shoebox is fabricated from FSC-certified unbleached Kraft paper with plant-based soy inks. Zero single-use plastics from factory to doorstep.',
    tag: 'Sustainability',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 text-[#EDEDED]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAboutBreadcrumb) }}
      />

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 ambient-glow-hero rounded-3xl">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#141416] border border-[#24242C] shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=2400&auto=format&fit=crop&q=90"
            alt="SOLEVA Design Atelier"
            fill
            priority
            className="object-cover object-center brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
              <span>Our Ethos &amp; Heritage</span>
            </div>
            <h1 className="font-nike text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[0.9] text-gradient-silver">
              BUILT FOR THE CHOSEN STRIDE.
            </h1>
            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed">
              We started SOLEVA with a singular conviction: athletic footwear should never compromise between architectural beauty and radical mechanical performance.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story: Dual Column */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#CCFF00] flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Genesis in Bengaluru</span>
            </p>
            <h2 className="font-nike text-3xl sm:text-5xl tracking-tight text-white leading-tight">
              WHERE AEROSPACE DYNAMICS MEETS COURT HERITAGE.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
              <p>
                Founded in 2024 in Bengaluru — India’s innovation capital — SOLEVA was born out of frustration with mass-market running sneakers that wear out in 300 kilometres or sacrifice daily street elegance for garish synthetic finishes.
              </p>
              <p>
                Our engineering team partnered with automotive composite manufacturers and master footwear modelers in Porto, Portugal to engineer a new category: progressive athletic silhouettes that look sublime with tailored trousers, yet pack enough carbon-plate propulsive energy to shatter a half-marathon personal record.
              </p>
              <p>
                Today, our silhouettes are road-tested on the monsoon roads of Mumbai, the heat-baked trails of Karnataka, and the premier racing circuits of India.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="btn-nike-white text-xs inline-flex items-center gap-2">
                <span>Explore The 2026 Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#141416] border border-[#24242C]">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85"
                alt="SOLEVA Running Innovation"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#141416] border border-[#24242C] mt-8 sm:mt-12">
              <Image
                src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&auto=format&fit=crop&q=85"
                alt="SOLEVA Carbon Plate Assembly"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-[#131317] to-[#0D0D10]">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#CCFF00]">
              The Four Cornerstones
            </p>
            <h2 className="font-nike text-3xl sm:text-5xl tracking-tight text-white">
              ENGINEERED WITHOUT COMPROMISE.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Every detail from thread tensile strength to nitrogen injection pressure is calibrated to exact specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-2xl bg-[#17171C]/80 border border-white/[0.06] hover:border-white/20 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                    <Icon className="w-6 h-6 text-[#CCFF00]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {pillar.tag}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Atelier Headquarters Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl sm:rounded-3xl border border-[#24242C] bg-[#141418] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Flagship Innovation Centre
            </span>
            <h3 className="font-nike text-3xl sm:text-4xl text-white">
              BENGALURU DESIGN ATELIER &amp; LAB
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              UB City, Level 14, Concorde Block, Vittal Mallya Road, Bengaluru, Karnataka 560001, India.
              <br />
              Toll-Free Concierge: +91 1800 209 8888 • concierge@soleva.in
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link href="/contact" className="btn-nike-outline text-xs">
              Book Atelier Fitting
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
