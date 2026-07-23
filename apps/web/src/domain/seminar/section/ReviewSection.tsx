'use client';

import { useCarouselDots } from '@letscareer/hooks';
import { useRef } from 'react';
import { SEMINAR_REVIEWS } from '../data/reviews';
import ReviewCard from '../ui/ReviewCard';
import SeminarCarouselDots from '../ui/SeminarCarouselDots';

/**
 * S9 후기 섹션 — 실제 수강생 후기 8개를 가로 캐러셀로 노출한다.
 * 모바일은 scroll-snap + 도트 추적, 데스크톱은 가로 스크롤(도트 숨김).
 */
const ReviewSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToSlide } = useCarouselDots(trackRef);

  return (
    <section className="w-full bg-[#EFEFEF] px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 font-semibold">
            후기
          </p>
          <h2 className="text-small20 md:text-large26 text-neutral-0 font-bold">
            무료 세미나를 들은
            <br />
            실제 수강생들의 <br className="md:hidden" />
            <span className="bg-primary inline-block -rotate-2 rounded-none px-2 py-1 text-neutral-100">
              100% 솔직 후기
            </span>
            에요
          </h2>
        </div>

        <div
          ref={trackRef}
          // overflow-x-auto만 두면 overflow-y가 auto로 계산돼 세로 스크롤 컨테이너가
          // 되고, 모바일에서 세로 터치를 가로채 페이지 스크롤이 잠긴다.
          // overflow-y-hidden + touch-pan-x로 가로 전용 스크롤임을 명시한다.
          className="flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-2"
        >
          {SEMINAR_REVIEWS.map((review) => (
            <div key={review.id} className="w-4/5 shrink-0 sm:w-1/2 lg:w-1/3">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        <SeminarCarouselDots
          count={SEMINAR_REVIEWS.length}
          activeIndex={activeIndex}
          onSelect={scrollToSlide}
          label="후기 넘기기"
          itemLabel={(i) => `후기 ${i + 1}`}
        />
      </div>
    </section>
  );
};

export default ReviewSection;
