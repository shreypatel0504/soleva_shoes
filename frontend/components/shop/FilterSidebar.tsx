'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  category: string;
  setCategory: (cat: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  brand: string;
  setBrand: (brand: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  minPrice: number;
  setMinPrice: (p: number) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  onSaleOnly: boolean;
  setOnSaleOnly: (v: boolean) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onReset: () => void;
}

const CATEGORIES = [
  { label: 'All Shoes', value: '' },
  { label: 'Running', value: 'running' },
  { label: 'Sneakers & Street', value: 'sneakers' },
  { label: 'Casual & Lifestyle', value: 'casual' },
  { label: 'Training & Gym', value: 'sports' },
];

const GENDERS = [
  { label: 'All Genders', value: '' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
];

const BRANDS = ['All Brands', 'SOLEVA Core', 'AeroPulse', 'Veloce', 'Stratos', 'ApexLab'];

const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Grey', hex: '#707072' },
  { name: 'Red', hex: '#E01A22' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Brown', hex: '#78350F' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  setCategory,
  gender,
  setGender,
  brand,
  setBrand,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onSaleOnly,
  setOnSaleOnly,
  inStockOnly,
  setInStockOnly,
  onReset,
}) => {
  return (
    <div className="space-y-6 text-[#EDEDED] pr-2">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
        <span className="text-base font-semibold text-white">Filter</span>
        <button
          onClick={onReset}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Gender */}
      <div className="pb-5 border-b border-[#222228]">
        <h4 className="text-sm font-semibold text-white mb-3">Gender</h4>
        <div className="space-y-2">
          {GENDERS.map((g) => {
            const isSelected = gender.toLowerCase() === g.value.toLowerCase();
            return (
              <label
                key={g.label}
                className="flex items-center space-x-2.5 text-sm cursor-pointer hover:text-white text-neutral-300 select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => setGender(isSelected ? '' : g.value)}
                  className="w-4 h-4 rounded border-[#383842] bg-[#161619] text-white focus:ring-white"
                />
                <span className={isSelected ? 'font-semibold text-white' : ''}>{g.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Category Filter */}
      <div className="pb-5 border-b border-[#222228]">
        <h4 className="text-sm font-semibold text-white mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.value.toLowerCase();
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(isSelected ? '' : cat.value)}
                className={`block w-full text-left text-sm py-0.5 transition-colors ${
                  isSelected ? 'font-bold text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Shop By Price */}
      <div className="pb-5 border-b border-[#222228]">
        <h4 className="text-sm font-semibold text-white mb-3">Shop By Price</h4>
        <div className="space-y-2 text-sm text-neutral-400">
          {[
            { label: 'All Prices', min: 0, max: 50000 },
            { label: 'Under ₹10,000', min: 0, max: 10000 },
            { label: '₹10,000 - ₹15,000', min: 10000, max: 15000 },
            { label: '₹15,000 - ₹20,000', min: 15000, max: 20000 },
            { label: 'Over ₹20,000', min: 20000, max: 50000 },
          ].map((tier) => {
            const isSelected = minPrice === tier.min && maxPrice === tier.max;
            return (
              <button
                key={tier.label}
                onClick={() => {
                  setMinPrice(tier.min);
                  setMaxPrice(tier.max);
                }}
                className={`block w-full text-left py-0.5 transition-colors ${
                  isSelected ? 'font-bold text-white' : 'hover:text-white'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Nike Size Grid (Dark bordered buttons) */}
      <div className="pb-5 border-b border-[#222228]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Size (UK / India)</h4>
          {selectedSize && (
            <button
              onClick={() => setSelectedSize('')}
              className="text-[11px] text-neutral-400 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES.map((sz) => {
            const isSelected = selectedSize === String(sz);
            return (
              <button
                key={sz}
                onClick={() => setSelectedSize(isSelected ? '' : String(sz))}
                className={`py-2 text-xs font-medium rounded border transition-all text-center ${
                  isSelected
                    ? 'border-white bg-white text-black font-bold'
                    : 'border-[#2D2D35] bg-[#141416] text-neutral-300 hover:border-neutral-400'
                }`}
              >
                UK {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Nike Color Swatches */}
      <div className="pb-5 border-b border-[#222228]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Colour</h4>
          {selectedColor && (
            <button
              onClick={() => setSelectedColor('')}
              className="text-[11px] text-neutral-400 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {COLORS.map((c) => {
            const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => setSelectedColor(isSelected ? '' : c.name)}
                className="flex flex-col items-center group"
              >
                <span
                  className={`w-7 h-7 rounded-full transition-transform ${
                    c.border ? 'border border-neutral-600' : ''
                  } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0C0C0E] scale-110' : 'group-hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className={`text-[11px] mt-1 ${isSelected ? 'font-bold text-white' : 'text-neutral-400'}`}>
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Brand Filter */}
      <div className="pb-5 border-b border-[#222228]">
        <h4 className="text-sm font-semibold text-white mb-3">Brand</h4>
        <div className="space-y-2 text-sm text-neutral-400">
          {BRANDS.map((b) => {
            const brandVal = b === 'All Brands' ? '' : b;
            const isSelected = brand.toLowerCase() === brandVal.toLowerCase();
            return (
              <button
                key={b}
                onClick={() => setBrand(brandVal)}
                className={`block w-full text-left py-0.5 transition-colors ${
                  isSelected ? 'font-bold text-white' : 'hover:text-white'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Special Toggles */}
      <div className="space-y-2.5 pt-1">
        <label className="flex items-center space-x-2.5 text-sm cursor-pointer text-neutral-300 hover:text-white select-none">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[#383842] bg-[#161619] text-white focus:ring-white"
          />
          <span className={onSaleOnly ? 'font-semibold text-white' : ''}>Sale &amp; Offers</span>
        </label>
        <label className="flex items-center space-x-2.5 text-sm cursor-pointer text-neutral-300 hover:text-white select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[#383842] bg-[#161619] text-white focus:ring-white"
          />
          <span className={inStockOnly ? 'font-semibold text-white' : ''}>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};
