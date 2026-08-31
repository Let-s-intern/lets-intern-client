'use client';

import { useMemo, useState } from 'react';

import type { MentorReviewItem } from '@/api/mentor/mentorSchema';
import EmptyContainer from '@/common/container/EmptyContainer';
import { FilterDropdown } from '@/domain/challenge/my-challenge/mission/submit/ui/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';
import dayjs from '@/lib/dayjs';

interface MentorReviewSectionProps {
  reviewList: MentorReviewItem[];
  averageScore: number;
}

type SortValue = 'HIGH_SCORE' | 'LATEST';

const SORT_OPTIONS = [
  { value: 'HIGH_SCORE', label: '높은 평점순' },
  { value: 'LATEST', label: '최신순' },
];

const StarRating = ({
  score,
  starClassName = 'h-4 w-4',
}: {
  score: number;
  starClassName?: string;
}) => {
  const clamped = Math.max(0, Math.min(5, score));
  const fullCount = Math.floor(clamped);
  const hasHalf = clamped - fullCount > 0;

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullCount) {
          return (
            <img
              key={i}
              src="/icons/star-yellow.svg"
              alt=""
              className={starClassName}
            />
          );
        }
        if (i === fullCount && hasHalf) {
          return (
            <span key={i} className="relative inline-flex">
              <img
                src="/icons/star-unfill.svg"
                alt=""
                className={starClassName}
              />
              <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <img
                  src="/icons/star-yellow.svg"
                  alt=""
                  className={`${starClassName} max-w-none`}
                />
              </span>
            </span>
          );
        }
        return (
          <img
            key={i}
            src="/icons/star-unfill.svg"
            alt=""
            className={starClassName}
          />
        );
      })}
    </div>
  );
};

const ReviewCard = ({ review }: { review: MentorReviewItem }) => (
  <li className="border-neutral-80 flex flex-col gap-4 border-b py-4">
    <span className="text-xsmall16 text-neutral-45">
      {dayjs(review.createDate).format('YYYY.MM.DD. HH:mm')}
    </span>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <StarRating score={review.score} starClassName="h-[18px] w-[18px]" />
        <span className="text-xsmall16 text-neutral-20 font-semibold">
          {review.score.toFixed(1)}
        </span>
      </div>
      <div className="text-xsmall16 text-neutral-40 flex items-center gap-2">
        <span>참여 프로그램</span>
        <span className="h-5 w-[2px] bg-neutral-50" />
        <span>{review.programTitle || '-'}</span>
      </div>
      {review.review && (
        <p className="text-small18 text-neutral-0 whitespace-pre-line">
          {review.review}
        </p>
      )}
    </div>
  </li>
);

const MentorReviewSection = ({
  reviewList,
  averageScore,
}: MentorReviewSectionProps) => {
  const [sortValue, setSortValue] = useState<SortValue>('HIGH_SCORE');

  const sortedReviews = useMemo(() => {
    const list = [...reviewList];
    if (sortValue === 'HIGH_SCORE') {
      return list.sort(
        (a, b) =>
          b.score - a.score ||
          dayjs(b.createDate).valueOf() - dayjs(a.createDate).valueOf(),
      );
    }
    return list.sort(
      (a, b) => dayjs(b.createDate).valueOf() - dayjs(a.createDate).valueOf(),
    );
  }, [reviewList, sortValue]);

  const hasReviews = reviewList.length > 0;

  return (
    <section
      id="mentor-reviews"
      className="flex w-full scroll-mt-[84px] flex-col gap-6 md:scroll-mt-[115px]"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-medium22 text-neutral-0 font-bold">후기</h2>
        <span className="text-xsmall16 text-neutral-45">
          {reviewList.length}개의 후기
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {hasReviews ? (
          <>
            <div className="border-neutral-80 flex flex-col items-center gap-1 rounded-md border px-3 py-5">
              <span className="text-xlarge28 text-neutral-20 font-bold">
                {averageScore.toFixed(1)}
              </span>
              <StarRating score={averageScore} starClassName="h-6 w-6" />
            </div>

            <div className="flex justify-end">
              <FilterDropdown
                labelPrefix="정렬"
                isHideLabel
                options={SORT_OPTIONS}
                selectedValue={sortValue}
                onSelect={(value) => setSortValue(value as SortValue)}
                width="w-[8.25rem]"
                className="w-[8.25rem]"
              />
            </div>

            <ul className="flex flex-col gap-2">
              {sortedReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </ul>
          </>
        ) : (
          <EmptyContainer text="등록된 후기가 없습니다." />
        )}
      </div>
    </section>
  );
};

export default MentorReviewSection;
