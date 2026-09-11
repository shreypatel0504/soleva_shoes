'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { productApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Kinetic Runner', 'Triple Black', 'Veloce Minimalist', 'Hybrid Gore-X', 'Carbon', 'Slip-On'];

export const SearchBarModal: React.FC<SearchBarModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await productApi.getProducts({ search: query.trim(), limit: 5 });
        if (res.data?.data?.products) {
          setResults(res.data.data.products);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePopularClick = (term: string) => {
    onClose();
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141416] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#24242A] text-[#EDEDED]">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-[#24242A] px-6 py-5">
          <Search className="w-6 h-6 text-neutral-400 mr-3.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search footwear by model, silhouette, brand, or color..."
            className="w-full text-base sm:text-lg text-white placeholder-neutral-500 outline-none bg-transparent"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin mr-3" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white mr-3"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1C1C22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Content Area */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {/* Results List */}
          {results.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                Matching Footwear ({results.length})
              </p>
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1E1E22] transition-colors group"
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-[#18181C] border border-[#28282E] overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                      <p className="text-xs text-neutral-400">{product.category} • {product.gender.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {formatCurrency(product.price)}
                      </p>
                      <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto mt-1" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#24242A] text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-white hover:underline"
                >
                  View all results for &quot;{query}&quot; &rarr;
                </button>
              </div>
            </div>
          ) : query && !loading ? (
            <div className="text-center py-8 text-neutral-400">
              <p className="text-sm">No footwear matches &quot;{query}&quot;.</p>
              <p className="text-xs text-neutral-500 mt-1">Try another keyword or explore popular styles below.</p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="px-3 py-1.5 rounded-full bg-[#18181C] hover:bg-[#222228] border border-[#28282E] text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
