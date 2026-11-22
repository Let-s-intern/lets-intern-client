'use client';

import {
  LandingReview,
  useLandingReviewsQuery,
} from '@/api/program-category/programCategory';
import { twMerge } from '@/lib/twMerge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { maskName, pickReviewExcerpt } from './reviewExcerpt';

/** 후기 카드에 쌓을 후기 수 */
const REVIEW_ROW_COUNT = 5;
/** 답변이 빈 후기를 걸러도 3개가 남도록 조금 더 받는다 */
const REVIEW_FETCH_SIZE = 10;
/** 후기 섹션 id. 기본·포트폴리오 화면은 challenge-review, 마케팅·HR·PM 화면은 reviews */
const REVIEW_SECTION_IDS = ['challenge-review', 'reviews'];

const scrollToReviews = () => {
  const target = REVIEW_SECTION_IDS.map((id) =>
    document.getElementById(id),
  ).find(Boolean);
  target?.scrollIntoView({ behavior: 'smooth' });
};

/** 대표 이미지를 흐리게 깔아 정사각형 빈 곳을 채운다 */
const BlurredFill = ({
  src,
  compact = false,
}: {
  src?: string | null;
  compact?: boolean;
}) =>
  src ? (
    <img
      src={src}
      alt=""
      aria-hidden
      className={twMerge(
        'absolute inset-0 h-full w-full scale-125 object-cover',
        compact ? 'blur-sm' : 'blur-2xl',
      )}
    />
  ) : null;

/** 4:3 대표 이미지를 정사각형 가운데에 두고 위아래는 흐린 같은 이미지로 채운다 */
const MainSlide = ({
  main,
  imageSrc,
  compact,
}: {
  main: ReactNode;
  imageSrc?: string | null;
  compact?: boolean;
}) => (
  <div className="relative h-full w-full overflow-hidden">
    <BlurredFill src={imageSrc} compact={compact} />
    <div className="absolute inset-x-0 top-1/2 aspect-[4/3] -translate-y-1/2">
      {main}
    </div>
  </div>
);

/** 어둡게 깐 대표 이미지 위에 후기 5개를 쌓은 카드 한 장. 기수·버전은 보이지 않는다 */
const ReviewCardSlide = ({
  reviews,
  totalCount,
  imageSrc,
}: {
  reviews: LandingReview[];
  totalCount: number;
  imageSrc?: string | null;
}) => (
  <div className="relative h-full w-full overflow-hidden bg-neutral-10">
    <BlurredFill src={imageSrc} />
    <div className="absolute inset-0 bg-neutral-0/55" />
    <div className="relative flex h-full flex-col justify-center gap-2 px-11 py-3 md:gap-3 md:px-14 md:py-6">
      <p className="flex items-baseline justify-center gap-2 text-white">
        <span className="text-xsmall16 font-bold md:text-small20">
          수강생들의 솔직 후기
        </span>
        <span className="text-xxsmall12 text-white/70 md:text-xsmall14">
          누적 {totalCount.toLocaleString()}건
        </span>
      </p>
      <ul className="flex flex-col gap-1.5 md:gap-2">
        {reviews.map((review) => (
          <li
            key={review.reviewId}
            className="flex items-center gap-2 rounded-[10px] bg-white px-2 py-1.5 md:gap-3 md:rounded-[14px] md:px-3 md:py-2"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[6px] bg-neutral-90 md:h-12 md:w-12 md:rounded-[8px]">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col md:gap-0.5">
              <span className="text-[10px] text-neutral-40 md:text-xxsmall12">
                {maskName(review.name)}
              </span>
              <p className="line-clamp-1 text-xxsmall12 leading-snug text-neutral-0 md:line-clamp-2 md:text-xsmall14">
                {pickReviewExcerpt(review.itemList)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollToReviews}
        className="detail_gallery_review_more mx-auto text-xxsmall12 text-white underline underline-offset-4 md:text-xsmall14"
      >
        {totalCount.toLocaleString()}건 후기 더보기
      </button>
    </div>
  </div>
);

/** 미리보기 줄의 후기 카드 칸. 후기 건수까지 보인다 */
const ReviewCardThumb = ({
  imageSrc,
  totalCount,
}: {
  imageSrc?: string | null;
  totalCount: number;
}) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-neutral-10 leading-tight">
    <BlurredFill src={imageSrc} compact />
    <div className="absolute inset-0 bg-neutral-0/55" />
    <span className="relative text-xxsmall12 font-semibold text-white">
      후기
    </span>
    <span className="relative text-xxsmall12 font-semibold text-white">
      {totalCount.toLocaleString()}건
    </span>
  </div>
);

/**
 * 상세 상단 이미지. 정사각형 두 장 — 대표 이미지와 후기 카드.
 * 후기가 없으면 대표 이미지만 두고 화살표·미리보기 줄을 숨긴다
 */
const DetailGallery = ({
  main,
  imageSrc,
  challengeType,
  className,
  style,
}: {
  main: ReactNode;
  /** 흐린 채움·후기 카드 배경·후기 사진 칸에 쓰는 대표 이미지 주소 */
  imageSrc?: string | null;
  challengeType?: string | null;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { data } = useLandingReviewsQuery(
    challengeType ? [challengeType] : [],
    REVIEW_FETCH_SIZE,
  );
  const reviews = (data?.reviewList ?? [])
    .filter((r) => pickReviewExcerpt(r.itemList))
    .slice(0, REVIEW_ROW_COUNT);
  const total = reviews.length > 0 ? 2 : 1;
  const [index, setIndex] = useState(0);
  const current = Math.min(index, total - 1);
  const go = (next: number) => setIndex((next + total) % total);

  const slide = (i: number, compact = false) => {
    if (i === 0)
      return <MainSlide main={main} imageSrc={imageSrc} compact={compact} />;
    const totalCount = data?.totalCount ?? reviews.length;
    return compact ? (
      <ReviewCardThumb imageSrc={imageSrc} totalCount={totalCount} />
    ) : (
      <ReviewCardSlide
        reviews={reviews}
        totalCount={totalCount}
        imageSrc={imageSrc}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={twMerge(
          'group relative aspect-square w-full overflow-hidden rounded-xs',
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
              className="detail_gallery_prev absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-10 shadow-01 md:left-3 md:h-9 md:w-9"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={() => go(current + 1)}
              className="detail_gallery_next absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-10 shadow-01 md:right-3 md:h-9 md:w-9"
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
                  'detail_gallery_thumb relative block aspect-square w-full overflow-hidden rounded-xxs border-2 border-transparent',
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
