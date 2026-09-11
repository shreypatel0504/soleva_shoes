'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Product, Pagination } from '@/lib/types';
import { productApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 50000);
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get('onSale') === 'true');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // UI States
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1, limit: 12 });
  const [loading, setLoading] = useState(true);

  // Sync URL query when filters update
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (gender) params.set('gender', gender);
    if (brand) params.set('brand', brand);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedColor) params.set('color', selectedColor);
    if (minPrice > 0) params.set('minPrice', String(minPrice));
    if (maxPrice < 50000) params.set('maxPrice', String(maxPrice));
    if (onSaleOnly) params.set('onSale', 'true');
    if (inStockOnly) params.set('inStock', 'true');
    if (sort !== 'featured') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    if (search) params.set('search', search);

    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.replace(newUrl, { scroll: false });
  }, [category, gender, brand, selectedSize, selectedColor, minPrice, maxPrice, onSaleOnly, inStockOnly, sort, page, search, router]);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page,
          limit: 12,
          sort,
        };

        if (category) queryParams.category = category;
        if (gender) queryParams.gender = gender;
        if (brand) queryParams.brand = brand;
        if (selectedSize) queryParams.size = selectedSize;
        if (selectedColor) queryParams.color = selectedColor;
        if (minPrice > 0) queryParams.minPrice = minPrice;
        if (maxPrice < 50000) queryParams.maxPrice = maxPrice;
        if (onSaleOnly) queryParams.onSale = 'true';
        if (inStockOnly) queryParams.inStock = 'true';
        if (search) queryParams.search = search;

        const res = await productApi.getProducts(queryParams);
        if (res.data?.data?.products) {
          setProducts(res.data.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to load shop catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender, brand, selectedSize, selectedColor, minPrice, maxPrice, onSaleOnly, inStockOnly, sort, page, search]);

  const handleReset = () => {
    setCategory('');
    setGender('');
    setBrand('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice(0);
    setMaxPrice(50000);
    setOnSaleOnly(false);
    setInStockOnly(false);
    setSort('featured');
    setPage(1);
    setSearch('');
  };

  const getCatalogTitle = () => {
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Shoes`;
    if (gender) return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Shoes & Sneakers`;
    if (onSaleOnly) return 'Sale & Special Offers';
    if (search) return `Search Results for "${search}"`;
    return 'All Shoes & Sneakers';
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#EDEDED]">
      {/* NIKE DARK TOP CATALOG BAR */}
      <div className="sticky top-[68px] z-30 bg-[#0C0C0E]/95 backdrop-blur-md pt-2 pb-4 mb-6 border-b border-[#1F1F24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {getCatalogTitle()}{' '}
            <span className="text-neutral-400 font-normal text-lg sm:text-xl">
              ({pagination.total})
            </span>
          </h1>
        </div>

        {/* Right Controls: Hide/Show Filters + Sort By */}
        <div className="flex items-center space-x-4">
          {/* Hide/Show Filters Toggle (Desktop) */}
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="hidden lg:flex items-center space-x-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors"
          >
            <span>{isSidebarVisible ? 'Hide Filters' : 'Show Filters'}</span>
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 text-sm font-medium px-4 py-2 border border-[#2D2D35] bg-[#141416] text-white rounded-full hover:border-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center">
            <span className="text-sm text-neutral-400 mr-2 hidden sm:inline">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#141416] text-sm font-medium text-white border border-[#282830] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low-High</option>
              <option value="price_desc">Price: High-Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER PILLS */}
      {(category || gender || brand || selectedSize || selectedColor || minPrice > 0 || maxPrice < 50000 || onSaleOnly) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {gender && (
            <button
              onClick={() => setGender('')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181C] border border-[#28282E] rounded-full text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>Gender: {gender}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {category && (
            <button
              onClick={() => setCategory('')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181C] border border-[#28282E] rounded-full text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>{category}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {selectedSize && (
            <button
              onClick={() => setSelectedSize('')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181C] border border-[#28282E] rounded-full text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>UK {selectedSize}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {selectedColor && (
            <button
              onClick={() => setSelectedColor('')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181C] border border-[#28282E] rounded-full text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>Color: {selectedColor}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {(minPrice > 0 || maxPrice < 50000) && (
            <button
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(50000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181C] border border-[#28282E] rounded-full text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>{formatCurrency(minPrice)} - {formatCurrency(maxPrice)}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-white underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* MAIN CATALOG BODY */}
      <div className="flex gap-8 items-start">
        {/* Left Sticky Sidebar (Desktop) */}
        {isSidebarVisible && (
          <aside className="w-60 flex-shrink-0 hidden lg:block sticky top-[148px] max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
            <FilterSidebar
              category={category}
              setCategory={setCategory}
              gender={gender}
              setGender={setGender}
              brand={brand}
              setBrand={setBrand}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onSaleOnly={onSaleOnly}
              setOnSaleOnly={setOnSaleOnly}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={handleReset}
            />
          </aside>
        )}

        {/* Product Grid Area */}
        <main className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">We couldn&apos;t find any matches</h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                Try expanding your search, clearing active filters or checking out our new arrivals.
              </p>
              <button onClick={handleReset} className="btn-nike-white mt-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-x-6 gap-y-10 ${
                  isSidebarVisible
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-14 pt-8 border-t border-[#1F1F24] flex items-center justify-center space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-white text-black font-bold'
                            : 'bg-[#18181C] text-neutral-300 hover:text-white border border-[#28282E]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#111114] border-l border-[#222228] shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-[#222228] flex items-center justify-between">
              <span className="font-bold text-base text-white">Filter</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar
                category={category}
                setCategory={setCategory}
                gender={gender}
                setGender={setGender}
                brand={brand}
                setBrand={setBrand}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                onSaleOnly={onSaleOnly}
                setOnSaleOnly={setOnSaleOnly}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                onReset={handleReset}
              />
            </div>
            <div className="p-4 border-t border-[#222228]">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-nike-white w-full py-3"
              >
                Apply ({pagination.total} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ShopContent />
    </Suspense>
  );
}
