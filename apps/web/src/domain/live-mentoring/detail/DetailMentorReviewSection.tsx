'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  mentorDetailQueryOptions,
  mentorStatsQueryOptions,
} from '@/api/mentor/mentor';
import type { MentorReviewItem } from '@/api/mentor/mentorSchema';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';

import DetailSection from './DetailSection';

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
  <li className="border-neutral-85 flex flex-col gap-3 rounded-lg border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-6">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <StarRating score={review.score} starClassName="h-4 w-4" />
        <span className="text-xsmall14 text-neutral-10 font-bold">
          {review.score.toFixed(1)}
        </span>
      </div>
      <span className="text-xxsmall12 shrink-0 text-neutral-50">
        {dayjs(review.createDate).format('YYYY.MM.DD')}
      </span>
    </div>
    {review.programTitle && (
      <span className="bg-primary-10 text-primary text-xxsmall12 w-fit rounded-full px-2.5 py-1 font-semibold">
        {review.programTitle}
      </span>
    )}
    {review.review && (
      <p className="text-xsmall14 md:text-xsmall16 text-neutral-10 whitespace-pre-line leading-relaxed">
        {review.review}
      </p>
    )}
  </li>
);

/** 점수별 후기 수. 반올림한 점수(1~5)로 묶는다. */
const countByScore = (reviews: MentorReviewItem[]) => {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const bucket = Math.min(5, Math.max(1, Math.round(r.score)));
    counts[bucket - 1] += 1;
  });
  return counts;
};

interface DetailMentorReviewSectionProps {
  id: string;
  mentorId: string;
}

/**
 * 멘토 후기 — 멘토 프로필(`/mentors/[mentorId]`)의 후기 섹션과 같은 출처. 모양은 이 상세의
 * 다른 섹션에 맞춰 가운데 헤더·요약 카드·후기 카드로 그린다.
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

  const scoreCounts = countByScore(sortedReviews);
  const maxCount = Math.max(...scoreCounts, 1);

  return (
    <DetailSection
      id={id}
      label="후기"
      title="수강생들이 직접 남긴 솔직한 멘토링 후기"
      subtitle="멘토님과 함께한 수강생분들의 이야기를 확인해보세요"
    >
      <div className="mx-auto flex w-full max-w-[840px] flex-col gap-5">
        {/* 요약 — 평균 평점과 점수별 분포 */}
        <div className="bg-primary-5 border-primary-10 flex flex-col items-center gap-5 rounded-xl border p-6 md:flex-row md:gap-10 md:px-10 md:py-8">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span className="text-neutral-0 text-[44px] font-bold leading-none">
              {stats.averageScore.toFixed(1)}
            </span>
            <StarRating score={stats.averageScore} starClassName="h-5 w-5" />
            <span className="text-xsmall14 text-neutral-40">
              {stats.reviewCount}개의 후기
            </span>
          </div>
          <ul className="flex w-full flex-col gap-1.5 md:flex-1">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = scoreCounts[score - 1];
              return (
                <li
                  key={score}
                  className="text-xxsmall12 text-neutral-40 flex items-center gap-3"
                >
                  <span className="w-6 shrink-0">{score}점</span>
                  <span className="bg-neutral-90 h-2 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-primary block h-full rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 shrink-0 text-right">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 정렬 */}
        <div role="radiogroup" aria-label="후기 정렬" className="flex gap-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === sortValue;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => handleSortChange(option.value)}
                className={twMerge(
                  'text-xsmall14 rounded-full px-4 py-2 font-medium transition-colors',
                  isActive
                    ? 'bg-neutral-0 text-white'
                    : 'bg-neutral-95 text-neutral-40 hover:bg-neutral-90',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <ul className="flex flex-col gap-3">
          {sortedReviews.slice(0, visibleCount).map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))}
        </ul>

        {visibleCount < sortedReviews.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="border-neutral-80 text-xsmall14 text-neutral-20 hover:bg-neutral-95 mx-auto flex items-center gap-1.5 rounded-full border bg-white px-6 py-3 font-semibold transition-colors"
          >
            더보기
            <span aria-hidden="true" className="font-normal text-neutral-50">
              {visibleCount}/{sortedReviews.length}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 text-neutral-50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M4 6l4 4 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </DetailSection>
  );
};

export default DetailMentorReviewSection;
