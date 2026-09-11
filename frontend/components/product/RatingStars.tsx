import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;

          return (
            <Star
              key={star}
              className={`${starSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-zinc-300'
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs font-semibold text-zinc-600">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {reviewCount !== undefined && reviewCount > 0 && (
            <span className="text-zinc-400 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
