'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { Product, Review } from '@/lib/types';
import { productApi, reviewApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductCard } from '@/components/product/ProductCard';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { ReviewFormModal } from '@/components/product/ReviewFormModal';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<'desc' | 'delivery' | 'reviews' | null>('desc');

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Hooks
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.data?.data?.product) {
          const prod = res.data.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.data.relatedProducts || []);

          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }
          if (prod.colors && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0].name);
          }

          try {
            const revRes = await reviewApi.getProductReviews(prod._id);
            if (revRes.data?.data?.reviews) {
              setReviews(revRes.data.data.reviews);
              setReviewStats({
                total: revRes.data.data.total,
                averageRating: revRes.data.data.averageRating,
              });
            }
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-square bg-[#161619] rounded-xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-32 bg-[#18181C] rounded" />
            <div className="h-8 w-3/4 bg-[#18181C] rounded" />
            <div className="h-6 w-1/3 bg-[#18181C] rounded" />
            <div className="h-32 w-full bg-[#18181C] rounded" />
            <div className="h-14 w-full bg-[#18181C] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-neutral-400 text-sm">The requested shoe model is currently unavailable.</p>
        <Link href="/shop" className="btn-nike-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleReviewSubmitted = (newReview: any) => {
    setReviews((prev) => [newReview, ...prev]);
    setReviewStats((prev) => {
      const newTotal = (prev.total || 0) + 1;
      const currentAvg = prev.averageRating || product.rating || 5;
      const newAvg = Number(
        (((currentAvg * (prev.total || 0)) + (newReview.rating || 5)) / newTotal).toFixed(1)
      );
      return { total: newTotal, averageRating: newAvg };
    });
    setProduct((prev) =>
      prev ? { ...prev, reviewCount: (prev.reviewCount || 0) + 1 } : prev
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    await addToCart(product, selectedSize, selectedColor || 'Default', 1);
  };

  const getSubtitle = () => {
    const isClothing = product.department === 'clothing';
    const gender = product.gender
      ? product.gender.charAt(0).toUpperCase() + product.gender.slice(1)
      : "Men's";
    const cat = product.category
      ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
      : isClothing ? 'Apparel' : 'Shoes';
    if (isClothing) {
      return `${gender}'s Technical ${cat}`;
    }
    return `${gender} ${cat} Shoes`;
  };

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description || product.shortDescription,
        sku: product.sku || `SLV-${product.slug}`,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'SOLEVA',
        },
        offers: {
          '@type': 'Offer',
          url: `https://soleva.in/product/${product.slug}`,
          priceCurrency: 'INR',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'SOLEVA India',
          },
        },
        aggregateRating:
          reviewStats.total > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: reviewStats.averageRating || product.rating || 4.9,
                reviewCount: reviewStats.total || product.reviewCount || 12,
              }
            : {
                '@type': 'AggregateRating',
                ratingValue: product.rating || 4.9,
                reviewCount: product.reviewCount || 18,
              },
      }
    : null;

  const breadcrumbSchema = product
    ? {
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
            name: 'Shop',
            item: 'https://soleva.in/shop',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.category || 'Footwear',
            item: `https://soleva.in/shop?category=${product.category?.toLowerCase()}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: product.name,
            item: `https://soleva.in/product/${product.slug}`,
          },
        ],
      }
    : null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-12 text-[#EDEDED]">
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* Semantic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category?.toLowerCase()}`}
          className="hover:text-white transition-colors"
        >
          {product.category || 'Footwear'}
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2-Column Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* Left: Multi-Angle Gallery */}
        <div className="lg:col-span-7">
          {(() => {
            const activeColorObj = product.colors?.find((c) => c.name === selectedColor);
            const currentGalleryImages =
              activeColorObj?.images && activeColorObj.images.length > 0
                ? activeColorObj.images
                : product.images;
            return (
              <ProductGallery
                images={currentGalleryImages}
                productName={product.name}
                selectedColorImage={activeColorObj?.image}
                selectedColorName={selectedColor}
              />
            );
          })()}
        </div>

        {/* Right: Nike Sticky Dark Buy Box */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Subtitle & Title */}
          <div>
            <p className="text-sm font-medium text-[#8E8E93] mb-1">
              {getSubtitle()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-base sm:text-lg font-semibold text-white">
                MRP : {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#707074] line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8E8E93] mt-1">
              incl. of all taxes (Also includes all applicable duties)
            </p>
          </div>

          {/* Colorway Thumbnails */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">
                  Select Colorway
                </span>
                <span className="text-neutral-400 font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-10 h-10 rounded-xl border transition-all flex items-center justify-center p-0.5 shadow-md active:scale-95 ${
                        isSelected
                          ? 'ring-2 ring-white border-transparent scale-105 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                          : 'border-white/10 hover:border-white/40 opacity-80 hover:opacity-100'
                      }`}
                      title={`${c.name} (Click to view)`}
                    >
                      <span
                        className="w-full h-full rounded-[10px] block"
                        style={{ backgroundColor: c.hex }}
                      />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#CCFF00] border-2 border-black" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection Grid */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${sizeError ? 'text-red-500' : 'text-neutral-300'}`}>
                {sizeError
                  ? 'Please select a size'
                  : product.department === 'clothing'
                  ? 'Select Size (Apparel)'
                  : 'Select Size (UK)'}
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-400 hover:text-white underline font-medium"
              >
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(product.sizes || (product.department === 'clothing' ? ['S', 'M', 'L', 'XL'] : [6, 7, 8, 9, 10, 11])).map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={String(sz)}
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                    className={`py-3 text-sm font-semibold rounded-lg border transition-all text-center ${
                      isSelected
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-[#2D2D35] bg-[#141416] text-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {product.department === 'clothing' ? sz : `UK ${sz}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Nike Pill Action Buttons */}
          <div className="space-y-3 pt-3">
            {/* Primary Add to Bag (Crisp Solid White) */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <span>Add to Bag</span>
            </button>

            {/* Secondary Favourite (Dark Outline) */}
            <button
              onClick={() => toggleWishlist(product)}
              className="w-full py-4 rounded-full bg-transparent hover:border-white border border-[#33333C] text-white font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? 'fill-white text-white' : 'text-neutral-400'
                }`}
              />
              <span>{isFavorited ? 'Favourite Added' : 'Favourite'}</span>
            </button>
          </div>

          {/* Nike Dark Accordions */}
          <div className="border-t border-[#1F1F24] pt-4 space-y-4 text-sm text-white">
            {/* 1. Description Accordion */}
            <div className="border-b border-[#1F1F24] pb-4">
              <button
                onClick={() => setOpenSection(openSection === 'desc' ? null : 'desc')}
                className="w-full flex items-center justify-between font-medium text-base py-1"
              >
                <span>Product Description</span>
                {openSection === 'desc' ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {openSection === 'desc' && (
                <div className="pt-3 text-neutral-300 leading-relaxed text-sm space-y-3">
                  <p>{product.description}</p>

                  {product.specifications?.fabric && (
                    <div className="p-3.5 bg-[#141416] border border-[#24242A] rounded-xl space-y-2 text-xs">
                      <p className="font-bold text-white uppercase tracking-wider text-[11px]">Fabric &amp; Engineering</p>
                      <p className="text-neutral-300 leading-relaxed">{product.specifications.fabric}</p>
                      {product.specifications.fit && (
                        <p className="text-neutral-400"><strong className="text-white">Fit:</strong> {product.specifications.fit}</p>
                      )}
                      {product.specifications.care && (
                        <p className="text-neutral-400"><strong className="text-white">Care:</strong> {product.specifications.care}</p>
                      )}
                    </div>
                  )}

                  <ul className="list-disc pl-5 pt-2 space-y-1 text-xs text-neutral-400">
                    <li>Colour Shown: {selectedColor || 'Signature'}</li>
                    <li>Style Code: {product.sku}</li>
                    <li>Department: {product.department === 'clothing' ? 'High-Performance Apparel' : 'Engineered Footwear'}</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Free Delivery & Returns Accordion */}
            <div className="border-b border-[#1F1F24] pb-4">
              <button
                onClick={() => setOpenSection(openSection === 'delivery' ? null : 'delivery')}
                className="w-full flex items-center justify-between font-medium text-base py-1"
              >
                <span>Free Delivery and Returns</span>
                {openSection === 'delivery' ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {openSection === 'delivery' && (
                <div className="pt-3 text-neutral-300 text-sm space-y-2">
                  <p>Your order of ₹14,000 or more gets free standard delivery across India.</p>
                  <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1">
                    <li>Standard ground delivery: 3–5 business days across India</li>
                    <li>Priority Blue Dart air express: 1–2 business days</li>
                    <li>Soleva Members enjoy hassle-free 30-day returns</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Reviews Accordion */}
            <div className="border-b border-[#1F1F24] pb-4">
              <button
                onClick={() => setOpenSection(openSection === 'reviews' ? null : 'reviews')}
                className="w-full flex items-center justify-between font-medium text-base py-1"
              >
                <span>Reviews ({reviewStats.total || product.reviewCount || 0})</span>
                <div className="flex items-center gap-2">
                  <div className="flex text-white">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating) ? 'fill-white' : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  {openSection === 'reviews' ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>
              {openSection === 'reviews' && (
                <div className="pt-3 space-y-4">
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="underline font-medium text-xs text-white hover:text-neutral-300"
                  >
                    Write a Review
                  </button>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-neutral-400">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="pt-3 border-t border-[#222228] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{rev.title}</span>
                          <span className="text-neutral-500">{formatDate(rev.createdAt)}</span>
                        </div>
                        <p className="text-xs text-neutral-300">{rev.comment}</p>
                        <p className="text-[11px] text-neutral-500">— {typeof rev.user === 'object' && rev.user?.name ? rev.user.name : 'Verified Athlete'}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "You Might Also Like" Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#1F1F24]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialTab={product.department === 'clothing' ? 'clothing' : 'footwear'}
      />
      {product && (
        <ReviewFormModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={product._id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
