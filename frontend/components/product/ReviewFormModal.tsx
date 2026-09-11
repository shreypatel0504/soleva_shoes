'use client';

import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { reviewApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface ReviewFormModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: any) => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  productId,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({
        type: 'warning',
        title: 'Sign in required',
        message: 'Please log in to submit a verified product review.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await reviewApi.createReview(productId, { rating, title, comment });
      if (res.data.success) {
        showToast({
          type: 'success',
          title: 'Review Posted',
          message: 'Thank you for your valuable feedback!',
        });
        onReviewSubmitted(res.data.data.review);
        onClose();
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Submission Error',
        message: err.response?.data?.message || 'Failed to submit review.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141416] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#28282E] text-white">
        <div className="p-6 border-b border-[#222228] flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-white">Write a Review</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-[#222228] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-neutral-400">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Incredibly responsive and sleek"
              className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Review Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Review Details
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe fit, cushioning, durability, and your experience wearing these shoes..."
              className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white resize-none transition-colors"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#2D2D35] text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-nike-white text-xs px-6 py-2.5 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
