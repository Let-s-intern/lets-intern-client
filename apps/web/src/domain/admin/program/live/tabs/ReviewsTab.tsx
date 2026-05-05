'use client';

import { useGetLiveReviewsAdminQuery } from '@/api/program';
import type { ReviewType } from '@/schema';
import { useMemo, useState } from 'react';

const TRUNCATE_LENGTH = 200;

interface ReviewsTabProps {
  liveId: number;
}

/**
 * PRD-서면라이브 분리 §5.4 — 어드민 라이브 상세 리뷰 탭.
 *
 * `useGetLiveReviewsAdminQuery` 의 응답은 `LiveReviewListSchema` 로 파싱되며
 * `reviewList: ReviewType[]` 형태이다. 각 항목의 `score` 를 별점으로,
 * `content` 를 본문으로 표시한다.
 *
 * TODO(BE): 응답 키 (`reviewList` vs 다른 이름)와 페이지네이션 메타 확인 후
 * 필요하면 client-side 슬라이싱 → server pageable 로 전환.
 */
const ReviewsTab = ({ liveId }: ReviewsTabProps) => {
  const { data, isLoading, isError, error } = useGetLiveReviewsAdminQuery({
    liveId,
    enabled: Number.isFinite(liveId) && liveId > 0,
  });

  const reviews = useMemo<ReviewType[]>(() => data?.reviewList ?? [], [data]);

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-xsmall14 text-system-error py-16 text-center">
        리뷰를 불러오지 못했습니다.
        {error instanceof Error ? ` (${error.message})` : null}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        리뷰가 없습니다.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </ul>
  );
};

export default ReviewsTab;

interface ReviewCardProps {
  review: ReviewType;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const score = review.score;
  const author = review.name ?? '익명';
  const createdDate = review.createdDate ?? '-';
  const content = review.content ?? '';
  const isLong = content.length > TRUNCATE_LENGTH;
  const visibleContent =
    !expanded && isLong ? `${content.slice(0, TRUNCATE_LENGTH)}…` : content;

  return (
    <li className="border-neutral-80 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating score={score} />
          <span className="text-xsmall14 text-neutral-30">({score}/5)</span>
        </div>
        <span className="text-xsmall12 text-neutral-40">{createdDate}</span>
      </div>
      <div className="text-xsmall14 text-neutral-0 mb-2 font-semibold">
        {author}
      </div>
      <p className="text-xsmall14 text-neutral-20 whitespace-pre-wrap">
        {visibleContent}
      </p>
      {isLong ? (
        <button
          type="button"
          className="text-xsmall12 text-primary-30 mt-2 underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '접기' : '더보기'}
        </button>
      ) : null}
    </li>
  );
}

function StarRating({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(score)));
  return (
    <span aria-label={`별점 ${clamped}점`} className="text-system-warning">
      {'★'.repeat(clamped)}
      <span className="text-neutral-70">{'★'.repeat(5 - clamped)}</span>
    </span>
  );
}
