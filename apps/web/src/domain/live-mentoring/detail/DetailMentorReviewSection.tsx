'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  mentorDetailQueryOptions,
  mentorStatsQueryOptions,
} from '@/api/mentor/mentor';
import type { MentorReviewItem } from '@/api/mentor/mentorSchema';
import dayjs from '@/lib/dayjs';

const PAGE_SIZE = 5;

type SortValue = 'HIGH_SCORE' | 'LATEST';

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'HIGH_SCORE', label: '높은 평점순' },
  { value: 'LATEST', label: '최신순' },
];

const byLatest = (a: MentorReviewItem, b: MentorReviewItem) =>
  dayjs(b.createDate).valueOf() - dayjs(a.createDate).valueOf();

const StarRating = ({
  score,
  starClassName,
}: {
  score: number;
  starClassName: string;
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

const ReviewItem = ({ review }: { review: MentorReviewItem }) => (
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

interface DetailMentorReviewSectionProps {
  id: string;
  mentorId: string;
}

/**
 * 멘토 후기 — 멘토 프로필(`/mentors/[mentorId]`)의 후기 섹션과 같은 모양·같은 출처.
 *
 * 멘토가 고른 몇 개가 아니라 멘토가 받은 공개 후기 전체를 보여준다. 목록은
 * `GET /mentor/{mentorId}`, 후기 수·평균 평점은 `GET /mentor/{mentorId}/stats`
 * 에서 온다 — 프로필 히어로와 숫자를 맞추기 위해서다. 두 API 의 mentorId 는
 * 이 상세의 mentorId 와 같은 값(멘토 user id)이다.
 *
 * 조회에 실패하거나 후기가 없으면 섹션째 그리지 않는다. 미리보기도 같다.
 */
const DetailMentorReviewSection = ({
  id,
  mentorId,
}: DetailMentorReviewSectionProps) => {
  const { data: mentor } = useQuery(mentorDetailQueryOptions(mentorId));
  const { data: stats } = useQuery(mentorStatsQueryOptions(mentorId));
  const [sortValue, setSortValue] = useState<SortValue>('HIGH_SCORE');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const reviewList = mentor?.reviewList;
  const sortedReviews = useMemo(() => {
    if (!reviewList) return [];
    return [...reviewList].sort(
      sortValue === 'HIGH_SCORE'
        ? (a, b) => b.score - a.score || byLatest(a, b)
        : byLatest,
    );
  }, [reviewList, sortValue]);

  if (!stats || sortedReviews.length === 0) return null;

  const handleSortChange = (value: SortValue) => {
    setSortValue(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section id={id} className="w-full scroll-mt-16 bg-white py-16 md:py-24">
      <div className="mw-1180 flex flex-col gap-6 px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-medium22 text-neutral-0 font-bold">후기</h2>
          <span className="text-xsmall16 text-neutral-45">
            {stats.reviewCount}개의 후기
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="border-neutral-80 flex flex-col items-center gap-1 rounded-md border px-3 py-5">
            <span className="text-xlarge28 text-neutral-20 font-bold">
              {stats.averageScore.toFixed(1)}
            </span>
            <StarRating score={stats.averageScore} starClassName="h-6 w-6" />
          </div>

          <div className="flex justify-end">
            <select
              aria-label="후기 정렬"
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value as SortValue)}
              className="rounded-xs border-neutral-80 text-neutral-0 w-[8.25rem] cursor-pointer border bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="flex flex-col gap-2">
            {sortedReviews.slice(0, visibleCount).map((review, index) => (
              <ReviewItem key={index} review={review} />
            ))}
          </ul>

          {visibleCount < sortedReviews.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="border-neutral-80 text-xsmall16 text-neutral-20 mt-4 w-full rounded-md border bg-white py-3 font-medium hover:bg-gray-50"
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetailMentorReviewSection;
