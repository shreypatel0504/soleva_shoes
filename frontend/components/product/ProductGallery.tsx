'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, RotateCw, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  selectedColorImage?: string;
  selectedColorName?: string;
}

const ANGLE_METADATA = [
  { label: 'Lateral Profile', short: 'Profile', tag: 'Hero Angle' },
  { label: 'Dynamic 3/4 View', short: '3/4 Angle', tag: 'Perspective' },
  { label: 'Outsole & Cushion Tech', short: 'Sole Tech', tag: 'Underfoot' },
  { label: 'Heel & Craft Detail', short: 'Detail', tag: 'Materials' },
  { label: 'Overhead Lacing', short: 'Top-Down', tag: 'Lockdown' },
  { label: 'Studio Showcase', short: 'Alternate', tag: 'Studio' },
];

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  selectedColorImage,
  selectedColorName,
}) => {
  // Compute active image set: if selectedColorImage exists and is not already in images,
  // put it first or active.
  const galleryImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return selectedColorImage ? [selectedColorImage] : [];
    }
    if (selectedColorImage && !images.includes(selectedColorImage)) {
      return [selectedColorImage, ...images];
    }
    return images;
  }, [images, selectedColorImage]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // If a colorway image is selected, jump to it
  useEffect(() => {
    if (selectedColorImage) {
      const idx = galleryImages.indexOf(selectedColorImage);
      if (idx !== -1) {
        setSelectedIndex(idx);
      } else {
        setSelectedIndex(0);
      }
    }
  }, [selectedColorImage, galleryImages]);

  // Keep selectedIndex within bounds
  useEffect(() => {
    if (selectedIndex >= galleryImages.length) {
      setSelectedIndex(0);
    }
  }, [galleryImages.length, selectedIndex]);

  const handleNext = () => {
    if (galleryImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const handlePrev = () => {
    if (galleryImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const currentImage = galleryImages[selectedIndex] || galleryImages[0] || '';
  const currentAngle = ANGLE_METADATA[selectedIndex] || {
    label: `Angle ${selectedIndex + 1}`,
    short: `Angle ${selectedIndex + 1}`,
    tag: 'View',
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6 select-none">
      {/* Thumbnails Strip with Angle Labels */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] no-scrollbar flex-shrink-0 py-1 px-0.5">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            const meta = ANGLE_METADATA[idx] || { short: `Angle ${idx + 1}` };
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`group relative flex flex-col items-center w-20 sm:w-24 bg-gradient-to-b from-[#16161C] to-[#0D0D11] rounded-xl border p-1.5 transition-all text-left flex-shrink-0 ${
                  isSelected
                    ? 'border-white ring-2 ring-white/60 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]'
                    : 'border-white/[0.08] hover:border-white/30 hover:bg-[#1A1A22]'
                }`}
                title={`${productName} — ${meta.short}`}
                aria-label={`View ${meta.short}`}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black/40">
                  <Image
                    src={img}
                    alt={`${productName} angle ${idx + 1}`}
                    fill
                    sizes="96px"
                    className={`object-contain p-1 transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#CCFF00] ring-2 ring-black" />
                  )}
                </div>

                {/* Angle Tag Below Thumbnail */}
                <div className="w-full mt-1.5 px-0.5 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-semibold tracking-wider uppercase truncate ${
                      isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {meta.short}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">
                    0{idx + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Focus Gallery Viewport with Click-to-Cycle & Chevrons */}
      <div className="relative flex-1 aspect-square sm:aspect-[4/3] md:aspect-square bg-gradient-to-b from-[#16161D] via-[#101015] to-[#0A0A0E] rounded-2xl sm:rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl group">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,0.04),transparent_65%)] pointer-events-none" />

        {/* Top-Left Floating Badge: Angle Name & Counter */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-xs font-medium text-white shadow-xl pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00] animate-pulse" />
          <span className="font-semibold tracking-wide text-neutral-100">{currentAngle.label}</span>
          <span className="text-white/30">•</span>
          <span className="text-neutral-400 text-[11px] font-mono">
            {selectedIndex + 1} / {galleryImages.length}
          </span>
        </div>

        {/* Top-Right Action: Fullscreen Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
          title="Inspect High-Resolution View"
          aria-label="Inspect High-Resolution View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Main Interactive Shoe Image (Tapping cycles to next angle) */}
        <div
          onClick={handleNext}
          className="relative w-full h-full p-8 sm:p-14 flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-[0.99]"
          title="Click to view next angle"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNext();
            }
          }}
        >
          {currentImage ? (
            <div
              className={`relative w-full h-full transition-all duration-300 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <Image
                src={currentImage}
                alt={`${productName} — ${currentAngle.label}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="text-neutral-600 text-sm">No image available</div>
          )}
        </div>

        {/* Navigation Arrow Overlays (Left & Right Chevrons) */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/95 backdrop-blur-xl border border-white/15 text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
              aria-label="Previous shoe angle"
              title="Previous angle"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/95 backdrop-blur-xl border border-white/15 text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 shadow-2xl active:scale-95"
              aria-label="Next shoe angle"
              title="Next angle"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Center Pill: Cycle Angle Hint */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[11px] text-neutral-300 shadow-xl pointer-events-none opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <RotateCw className="w-3 h-3 text-[#CCFF00] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Tap shoe or use arrows to cycle angles</span>
          </div>
        )}

        {/* Mobile Pagination Dots */}
        {galleryImages.length > 1 && (
          <div className="flex sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 gap-1.5 pointer-events-none">
            {galleryImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === selectedIndex ? 'w-5 bg-[#CCFF00]' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen High-Definition Inspection Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-10 animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Header Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between py-4 text-white z-10">
            <div>
              <h3 className="text-lg font-semibold tracking-wide text-white">{productName}</h3>
              <p className="text-xs text-neutral-400">
                {currentAngle.label} • Angle {selectedIndex + 1} of {galleryImages.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
              aria-label="Close High-Resolution Inspector"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* High-Resolution Expanded Canvas */}
          <div
            className="relative w-full max-w-5xl aspect-video sm:aspect-[16/10] bg-gradient-to-b from-[#141419] to-[#0A0A0E] rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center p-6 sm:p-12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage && (
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt={`${productName} — ${currentAngle.label}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}

            {/* Modal Navigation Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all border border-white/20 shadow-2xl"
                  aria-label="Previous angle"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all border border-white/20 shadow-2xl"
                  aria-label="Next angle"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Modal Bottom Thumbnails */}
          {galleryImages.length > 1 && (
            <div
              className="flex items-center gap-3 mt-6 overflow-x-auto max-w-full py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((img, idx) => {
                const isSelected = idx === selectedIndex;
                const meta = ANGLE_METADATA[idx] || { short: `Angle ${idx + 1}` };
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl border p-1 transition-all overflow-hidden ${
                      isSelected
                        ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/50 scale-105'
                        : 'border-white/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Angle ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
