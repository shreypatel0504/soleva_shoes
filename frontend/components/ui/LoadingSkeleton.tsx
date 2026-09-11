import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-[#141416] rounded-xl overflow-hidden border border-[#222228] animate-pulse">
      <div className="aspect-square bg-[#18181C]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-[#222228] rounded" />
          <div className="h-3 w-12 bg-[#222228] rounded" />
        </div>
        <div className="h-4 w-3/4 bg-[#222228] rounded" />
        <div className="h-3 w-1/2 bg-[#222228] rounded" />
        <div className="pt-3 border-t border-[#222228] flex justify-between items-center">
          <div className="h-5 w-20 bg-[#222228] rounded" />
          <div className="h-3 w-16 bg-[#222228] rounded" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
