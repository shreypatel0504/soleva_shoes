'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Free delivery across India on orders over ₹14,000 & 30-day returns.',
    cta: 'Shop Now',
    link: '/shop',
    highlight: null,
  },
  {
    id: 2,
    title: 'Move, Shop, Customise & Celebrate With Us.',
    cta: 'Use Code: WELCOME10',
    link: '/shop?onSale=true',
    highlight: 'WELCOME10',
  },
  {
    id: 3,
    title: 'Soleva Members get Exclusive Drops & Priority Dispatch.',
    cta: 'Join Us',
    link: '/register',
    highlight: null,
  },
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      className="bg-[#111114] text-[#D1D1D6] text-xs py-2 px-4 border-b border-[#1F1F24] select-none transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="p-1 text-neutral-500 hover:text-white rounded transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Center Text with Smooth Fade Transition */}
        <div className="flex-1 text-center truncate px-2">
          <span className="font-medium text-neutral-300 mr-2">
            {current.title}
          </span>
          <Link
            href={current.link}
            className="underline underline-offset-2 font-semibold text-white hover:text-neutral-300 transition-colors inline-flex items-center"
          >
            {current.highlight ? (
              <span className="text-[#E01A22] font-bold mr-1">{current.highlight}</span>
            ) : null}
            <span>{current.cta}</span>
          </Link>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="p-1 text-neutral-500 hover:text-white rounded transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
