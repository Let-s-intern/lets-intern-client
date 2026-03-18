import Image from 'next/image';
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
      className={`w-[280px] flex-shrink-0 overflow-hidden rounded-lg shadow-lg md:w-[320px] ${className}`}
    >
      <Image
        src={review.image}
        alt={review.alt}
        width={320}
        height={400}
        className="h-auto w-full object-contain"
      />
    </div>
  );
});

export default ReviewCard;
