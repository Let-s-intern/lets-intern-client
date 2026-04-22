import { memo } from 'react';
import type { UserReview } from '../types';

interface ReviewCardProps {
  review: UserReview;
  className?: string;
}

const ReviewCard = memo(function ReviewCard({
  review,
  className = '',
}: ReviewCardProps) {
  return (
    <div
      className={`rounded-2xl flex h-full flex-col border border-white/10 bg-white/5 p-6 md:p-8 ${className}`}
    >
      {/* Avatar + Title */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#7C6BFF]/20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="8" r="4" fill="#B49AFF" />
            <path
              d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
              stroke="#B49AFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="break-keep text-sm font-bold leading-snug text-white md:text-base">
          {review.title}
        </h3>
      </div>

      {/* Content */}
      <p className="break-keep text-xs leading-relaxed text-gray-300 md:text-sm">
        {review.content}
      </p>
    </div>
  );
});

export default ReviewCard;
