'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [addedSize, setAddedSize] = useState<number | null>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product._id);

  const currentColorObj = product.colors?.[selectedColorIdx];
  const colorImages = currentColorObj?.images && currentColorObj.images.length > 0 ? currentColorObj.images : null;

  const primaryImage = colorImages?.[0] || currentColorObj?.image || product.images[0] || '/products/apexlab/orange_profile.jpg';
  const secondaryImage = colorImages?.[1] || product.images[1] || primaryImage;

  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [secImgSrc, setSecImgSrc] = useState(secondaryImage);

  React.useEffect(() => {
    const pImg = colorImages?.[0] || currentColorObj?.image || product.images[0] || '/products/apexlab/orange_profile.jpg';
    const sImg = colorImages?.[1] || product.images[1] || pImg;
    setImgSrc(pImg);
    setSecImgSrc(sImg);
  }, [product, selectedColorIdx, currentColorObj, colorImages]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickSizeSelect = async (e: React.MouseEvent, sz: number) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedSize(sz);
    const chosenColor = product.colors?.[selectedColorIdx]?.name || 'Default';
    await addToCart(product, sz, chosenColor, 1);
    setTimeout(() => {
      setAddedSize(null);
    }, 1200);
  };

  const getSubtitle = () => {
    const gender = product.gender
      ? product.gender.charAt(0).toUpperCase() + product.gender.slice(1)
      : "Men's";
    const cat = product.category
      ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
      : 'Shoes';
    return `${gender} ${cat} Shoes`;
  };

  const colors = product.colors || [];
  const colorCount = colors.length || 1;
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes.slice(0, 5) : [7, 8, 9, 10, 11];

  return (
    <div
      className="group relative flex flex-col transition-all duration-300 cursor-pointer select-none rounded-2xl p-2 bg-[#0E0E12]/50 hover:bg-[#131318] border border-white/[0.05] hover:border-white/[0.18] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dark Image Container with Crisp Presentation */}
      <div className="relative block aspect-[4/4.2] w-full overflow-hidden bg-[#141418] rounded-xl border border-white/[0.04] transition-all">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* Angle 1: Lateral Profile */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
            onError={() => setImgSrc('/products/apexlab/orange_profile.jpg')}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && secImgSrc !== imgSrc
                ? 'opacity-0 scale-105'
                : isHovered
                ? 'opacity-100 scale-105 -rotate-1 -translate-y-0.5'
                : 'opacity-100 scale-100'
            }`}
          />
          {/* Angle 2: Matching 3/4 Perspective of the EXACT same shoe */}
          {secImgSrc !== imgSrc && (
            <Image
              src={secImgSrc}
              alt={`${product.name} dynamic angle`}
              fill
              quality={90}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
              onError={() => setSecImgSrc(imgSrc)}
              className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
              }`}
            />
          )}
        </Link>

        {/* Crisp Luxury Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount && product.discount > 0 ? (
            <span className="text-[10px] font-bold text-white bg-[#E01A22] px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider backdrop-blur-sm">
              {product.discount}% OFF
            </span>
          ) : product.isNewArrival ? (
            <span className="text-[10px] font-bold text-black bg-[#CCFF00] px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              NEW
            </span>
          ) : product.isBestSeller ? (
            <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-white/20">
              BESTSELLER
            </span>
          ) : null}
        </div>

        {/* Favourites Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95"
          title={isFavorited ? 'Remove from Favourites' : 'Add to Favourites'}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isFavorited
                ? 'fill-rose-500 text-rose-500'
                : 'text-neutral-300 hover:text-white stroke-[2]'
            }`}
          />
        </button>

        {/* Quick Size Selector Overlay on Desktop Hover */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 pt-6 hidden sm:flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">
            Quick Add Size (UK)
          </span>
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickSizeSelect(e, sz)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-all ${
                  addedSize === sz
                    ? 'bg-white text-black border-white font-bold scale-105 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-[#18181E]/90 hover:bg-white hover:text-black text-neutral-300 border-white/10'
                }`}
              >
                {addedSize === sz ? <Check className="w-3 h-3 inline text-emerald-600" /> : `${sz}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Details Stack */}
      <div className="pt-3 px-1 flex flex-col space-y-1">
        {/* Brand & Colors Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A0A0AB]">
            {product.brand || 'SOLEVA'}
          </span>
          {colors.length > 1 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((c, i) => (
                <span
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorIdx(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full border transition-all cursor-pointer ${
                    selectedColorIdx === i
                      ? 'ring-1 ring-white border-transparent scale-110'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-[10px] text-neutral-400 font-medium">+{colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Category Subtitle */}
        <p className="text-xs text-neutral-400 line-clamp-1">
          {getSubtitle()}
        </p>

        {/* Price Row with Rupee symbol and formatted spacing */}
        <div className="pt-1.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-500 line-through font-normal">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <span className="text-[11px] font-medium text-amber-400 flex items-center gap-0.5">
              ★ <span className="text-neutral-300">{product.rating.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
