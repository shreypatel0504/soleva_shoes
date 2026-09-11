import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#18181C] border border-[#28282E] flex items-center justify-center text-neutral-400 mb-5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#8E8E93] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="btn-nike-white text-xs px-7 py-3"
          >
            {actionText}
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="btn-nike-white text-xs px-7 py-3"
          >
            {actionText}
          </button>
        ) : null
      )}
    </div>
  );
};
