'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LandingSectionHeader from './LandingSectionHeader';
import type { LandingReview } from './landingContent';

interface Props {
  reviews: LandingReview[];
}

/** 모바일에서 접었을 때 보여줄 후기 수 (초과분은 더보기) */
const MOBILE_COLLAPSED_COUNT = 3;

/** 후기 섹션(#review) — 어드민 입력 후기(출처·결과태그·이미지·요약) 메이슨리. 카드 클릭 시 확대. */
export default function ReviewsSection({ reviews }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<LandingReview | null>(null);

  if (reviews.length === 0) return null;

  return (
    <section id="review" className="scroll-mt-20 bg-[#F4F5F9]">
      <div className="mx-auto w-full max-w-[1040px] px-5 py-12 md:px-0 md:py-[100px]">
        <LandingSectionHeader
          header="후기"
          mainHeader="렛츠커리어와 함께 취뽀한 분들의 후기"
          subHeader="인스타그램, 오픈채팅, 챌린지 커뮤니티에 직접 남겨주신 후기를 그대로 가져왔어요."
        />

        {/* 메이슨리 — 모바일 1열(3개+더보기), 데스크탑 3열 */}
        <div className="mt-10 gap-5 md:mt-14 md:columns-3">
          {reviews.map((review, i) => (
            <ReviewCard
              key={`${review.source}-${i}`}
              review={review}
              onClick={() => setSelected(review)}
              className={clsx(
                i >= MOBILE_COLLAPSED_COUNT && !expanded && 'hidden md:block',
              )}
            />
          ))}
        </div>

        {reviews.length > MOBILE_COLLAPSED_COUNT && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-xsmall14 mt-4 w-full rounded-sm border border-[#4A76FF] py-3 font-medium text-[#4A76FF] md:hidden"
          >
            더보기
          </button>
        )}

        <p className="text-xsmall14 md:text-small18 text-neutral-40 mt-10 text-center md:mt-16">
          렛츠커리어 프로그램에 참여한 취준생들의 실제 후기입니다.
        </p>
      </div>

      {selected && (
        <ReviewLightbox review={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function ReviewCard({
  review,
  onClick,
  className,
}: {
  review: LandingReview;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'mb-5 block w-full break-inside-avoid rounded-[20px] bg-white p-5 text-left shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-primary text-xsmall14 flex items-center gap-1.5 font-semibold">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          {review.source}
        </span>
        {review.resultTags.length > 0 && (
          <span className="text-xsmall14 shrink-0 font-semibold text-[#4a76ff]">
            {review.resultTags.join(' · ')}
          </span>
        )}
      </div>

      {review.imageUrl ? (
        <img
          alt=""
          className="rounded-ms mt-3 w-full"
          loading="lazy"
          src={review.imageUrl}
        />
      ) : (
        <div className="bg-neutral-80 mt-3 aspect-[4/3] w-full rounded-lg" />
      )}

      <p className="text-xsmall14 md:text-small18 text-neutral-30 mt-4 whitespace-pre-line">
        {review.summary}
      </p>
    </button>
  );
}

/** 후기 카드 클릭 시 확대 — body 포털. 배경/✕/ESC 로 닫힌다. */
function ReviewLightbox({
  review,
  onClose,
}: {
  review: LandingReview;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[20px] bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-neutral-40 hover:text-neutral-20 absolute right-4 top-4 text-lg"
        >
          ✕
        </button>

        <div className="flex items-center justify-between gap-2 pr-3 md:pr-5">
          <span className="text-primary text-xxsmall12 md:text-xsmall16 flex items-center gap-1.5 font-semibold">
            <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            {review.source}
          </span>
          {review.resultTags.length > 0 && (
            <span className="text-primary text-xxsmall12 md:text-xsmall16 shrink-0 font-semibold">
              {review.resultTags.join(' · ')}
            </span>
          )}
        </div>

        {review.imageUrl && (
          <img
            alt=""
            className="rounded-ms mt-4 w-full"
            src={review.imageUrl}
          />
        )}

        <p className="text-small16 md:text-small18 text-neutral-30 mt-5 whitespace-pre-line">
          {review.summary}
        </p>
      </div>
    </div>,
    document.body,
  );
}
