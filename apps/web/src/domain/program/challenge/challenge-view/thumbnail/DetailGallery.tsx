'use client';

import {
  LandingReview,
  useLandingReviewsQuery,
} from '@/api/program-category/programCategory';
import { twMerge } from '@/lib/twMerge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';

/** 대표 이미지 뒤에 넘겨 볼 후기 수 */
const REVIEW_SLIDE_COUNT = 4;

const maskName = (name?: string | null) =>
  name
    ? `${name.slice(0, 1)}${'*'.repeat(Math.max(name.length - 1, 2))}`
    : '수강생';

/** 좋았던 점 → 목표 달성 → 아무 답변 순으로 한 줄 */
const pickQuote = (items: LandingReview['itemList']) => {
  const by = (type: string) =>
    items.find((i) => i.questionType === type && i.answer?.trim())?.answer;
  return (
    by('GOOD_POINT') ??
    by('GOAL_RESULT') ??
    items.find((i) => i.answer?.trim())?.answer ??
    ''
  ).trim();
};

/** 후기 한 장. 기수·버전은 보이지 않는다 */
const ReviewSlide = ({
  review,
  compact = false,
}: {
  review: LandingReview;
  compact?: boolean;
}) => (
  <div
    className={twMerge(
      'flex h-full w-full flex-col bg-[#F3F4FF]',
      compact ? 'gap-1 p-1.5' : 'gap-4 p-8 md:p-10',
    )}
  >
    <span
      className={twMerge(
        'w-fit rounded-xxs bg-primary font-semibold text-white',
        compact ? 'px-1 text-[8px]' : 'px-2 py-1 text-xsmall14',
      )}
    >
      수강생 후기
    </span>
    <p
      className={twMerge(
        'flex-1 whitespace-pre-line text-neutral-0',
        compact
          ? 'line-clamp-3 text-[8px] leading-tight'
          : 'line-clamp-[7] text-small18 font-semibold leading-relaxed md:text-small20',
      )}
    >
      &ldquo;{pickQuote(review.itemList)}&rdquo;
    </p>
    {!compact && (
      <p className="text-xsmall14 text-neutral-40">{maskName(review.name)}</p>
    )}
  </div>
);

/**
 * 상세 상단 이미지. 대표 이미지 뒤로 평점 높은 후기 몇 장을 넘겨 본다.
 * 아래 미리보기 줄로 모두 몇 장인지 보이고 눌러서 바로 간다
 */
const DetailGallery = ({
  main,
  challengeType,
  className,
  style,
}: {
  main: ReactNode;
  challengeType?: string | null;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { data } = useLandingReviewsQuery(
    challengeType ? [challengeType] : [],
    REVIEW_SLIDE_COUNT,
  );
  const reviews = (data?.reviewList ?? [])
    .filter((r) => pickQuote(r.itemList))
    .slice(0, REVIEW_SLIDE_COUNT);
  const total = 1 + reviews.length;
  const [index, setIndex] = useState(0);
  const current = Math.min(index, total - 1);
  const go = (next: number) => setIndex((next + total) % total);

  const slide = (i: number, compact = false) =>
    i === 0 ? main : <ReviewSlide review={reviews[i - 1]} compact={compact} />;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={twMerge(
          'group relative aspect-[4/3] w-full overflow-hidden rounded-xs',
          className,
        )}
        style={current === 0 ? style : undefined}
      >
        {slide(current)}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="이전 이미지"
              onClick={() => go(current - 1)}
              className="detail_gallery_prev absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-10 shadow-01"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={() => go(current + 1)}
              className="detail_gallery_next absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-10 shadow-01"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-neutral-0/60 px-2.5 py-0.5 text-xxsmall12 text-white">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="flex gap-2">
          {Array.from({ length: total }, (_, i) => (
            <li key={i} className="w-[72px] md:w-[88px]">
              <button
                type="button"
                aria-label={`${i + 1}번째 이미지 보기`}
                onClick={() => setIndex(i)}
                className={twMerge(
                  'detail_gallery_thumb relative block aspect-[4/3] w-full overflow-hidden rounded-xxs border-2 border-transparent',
                  i === current ? 'border-primary' : 'opacity-70',
                )}
                style={i === 0 ? style : undefined}
              >
                {slide(i, true)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DetailGallery;
