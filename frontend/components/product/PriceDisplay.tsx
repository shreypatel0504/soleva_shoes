import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  discount,
  size = 'md',
}) => {
  const textSize =
    size === 'sm'
      ? 'text-sm'
      : size === 'md'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl';

  const strikeSize =
    size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs sm:text-sm' : 'text-base sm:text-lg';

  const isDiscounted = compareAtPrice && compareAtPrice > price;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-black tracking-tight text-zinc-950 ${textSize}`}>
        {formatCurrency(price)}
      </span>
      {isDiscounted && (
        <>
          <span className={`text-zinc-400 line-through font-normal ${strikeSize}`}>
            {formatCurrency(compareAtPrice)}
          </span>
          {discount ? (
            <span className="text-[10px] sm:text-xs font-extrabold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200">
              -{discount}%
            </span>
          ) : null}
        </>
      )}
    </div>
  );
};
