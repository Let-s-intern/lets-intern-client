'use client';

import { useState } from 'react';

import Dropdown from '@/common/dropdown/Dropdown';
import dayjs from '@/lib/dayjs';

import { MentorDetail } from '../data/dummyMentorDetail';
import { DUMMY_MENTOR_REVIEWS, MentorReview } from '../data/dummyMentorReviews';

const REVIEW_DATE_FORMAT = 'YYYY.MM.DD. HH:mm';

const SORT_OPTIONS = [
  { value: 'rating', label: '높은 평점순' },
  { value: 'latest', label: '최신순' },
  { value: 'earliest', label: '오래된순' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const sortReviews = (reviews: MentorReview[], sort: SortValue) => {
  const sorted = [...reviews];
  if (sort === 'rating') {
    sorted.sort((a, b) => b.score - a.score);
  } else {
    sorted.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    );
  }
  return sorted;
};

interface MentorReviewSectionProps {
  mentor: MentorDetail;
}

const Stars = ({ score, size = 20 }: { score: number; size?: number }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <img
        key={star}
        src={
          score >= star ? '/icons/star-yellow.svg' : '/icons/star-unfill.svg'
        }
        alt=""
        style={{ width: size, height: size }}
      />
    ))}
  </div>
);

const ReviewItem = ({ review }: { review: MentorReview }) => (
  <div className="border-neutral-90 flex flex-col gap-4 border-b py-6 first:pt-0 last:border-b-0">
    <span className="text-xsmall16 text-neutral-45">
      {dayjs(review.createdAt).format(REVIEW_DATE_FORMAT)}
    </span>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Stars score={review.score} size={18} />
        <span className="text-xsmall16 text-neutral-20 font-semibold">
          {review.score.toFixed(1)}
        </span>
      </div>

      <div className="text-xsmall16 text-neutral-40 flex items-center gap-2">
        <span className="border-r-2 border-neutral-50 pr-2">참여 프로그램</span>
        <span>{review.programTitle}</span>
      </div>

      <p className="text-small18 text-neutral-0 whitespace-pre-line leading-relaxed">
        {review.content}
      </p>
    </div>
  </div>
);

const MentorReviewSection = ({ mentor }: MentorReviewSectionProps) => {
  const [sort, setSort] = useState<SortValue>('rating');
  const sortedReviews = sortReviews(DUMMY_MENTOR_REVIEWS, sort);

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-medium22 text-neutral-0 font-bold">후기</h2>
        <span className="text-xsmall16 text-neutral-45">
          {mentor.stats.reviewCount}개의 후기
        </span>
      </div>
      <div className="flex w-full flex-col gap-2.5">
        <div className="border-1 border-neutral-80 rounded-xs flex flex-col items-center gap-1 border px-3 py-5">
          <span className="text-xlarge28 text-neutral-20 font-bold">
            {mentor.stats.rating.toFixed(1)}
          </span>
          <Stars score={Math.round(mentor.stats.rating)} size={26} />
        </div>

        <div className="flex justify-end">
          <Dropdown
            options={SORT_OPTIONS}
            value={sort}
            width={117}
            onChange={setSort}
          />
        </div>

        <div className="flex flex-col">
          {sortedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorReviewSection;
