'use client';

import { ProgramInfo } from '@/schema';
import { useCarouselDots } from '@letscareer/hooks';
import { Fragment, ReactNode, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import SeminarCarouselDots from '../ui/SeminarCarouselDots';

/** 상태(모집중/종료)에 따라 다른 카드를 그리기 위한 렌더 함수. */
type RenderCard = (program: ProgramInfo) => ReactNode;

const DESKTOP_PAGE_SIZE = 8; // 2행 × 4열
const MOBILE_PAGE_SIZE = 4; // 2행 × 2열

/** 배열을 size 개씩 페이지로 쪼갠다. */
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
};

const cardKey = (program: ProgramInfo) =>
  program.programInfo.programType + program.programInfo.id;

interface PagerArrowProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}

/** 데스크톱 페이지 이동 화살표 — 가로 오버플로우 방지를 위해 그리드 안쪽 가장자리에 배치. */
const PagerArrow = ({ direction, disabled, onClick }: PagerArrowProps) => {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? '이전 세미나' : '다음 세미나'}
      className={`text-neutral-0 absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition disabled:cursor-not-allowed disabled:opacity-30 ${isPrev ? 'left-4' : 'right-4'}`}
    >
      {isPrev ? <MdChevronLeft size={28} /> : <MdChevronRight size={28} />}
    </button>
  );
};

/** 데스크톱(md↑): 2×4 페이지 + 좌우 화살표. 8개 이하이면 화살표 없이 단일 페이지. */
const DesktopPagedGrid = ({
  programs,
  renderCard,
}: {
  programs: ProgramInfo[];
  renderCard: RenderCard;
}) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(programs.length / DESKTOP_PAGE_SIZE);
  const start = page * DESKTOP_PAGE_SIZE;
  const visible = programs.slice(start, start + DESKTOP_PAGE_SIZE);
  const hasPaging = pageCount > 1;

  return (
    // 좌우 화살표가 카드와 겹치지 않도록 그리드를 px-20 만큼 안쪽으로 넣어
    // 양옆에 전용 거터를 만든다(화살표는 이 거터 중앙에 배치).
    <div className="relative hidden md:block md:px-20">
      <div className="grid grid-cols-4 gap-x-5 gap-y-11">
        {visible.map((program) => (
          <Fragment key={cardKey(program)}>{renderCard(program)}</Fragment>
        ))}
      </div>

      {hasPaging && (
        <>
          <PagerArrow
            direction="prev"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          <PagerArrow
            direction="next"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
        </>
      )}
    </div>
  );
};

/** 모바일(<md): 2×2 페이지를 scroll-snap 스와이프 + 도트로 넘긴다. */
const MobileSwipeCarousel = ({
  programs,
  renderCard,
}: {
  programs: ProgramInfo[];
  renderCard: RenderCard;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToSlide } = useCarouselDots(trackRef);
  const pages = chunk(programs, MOBILE_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 md:hidden">
      <div
        ref={trackRef}
        // overflow-y-hidden + touch-pan-x: 세로 터치를 가로채 페이지 스크롤이
        // 잠기는 것을 막고 가로 전용 스와이프임을 명시한다(ReviewSection과 동일).
        // gap-5: 정지 시엔 화면 밖이지만 스와이프 중 페이지 경계를 분리한다
        // (없으면 앞/뒤 페이지 카드가 맞붙어 보인다).
        className="flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden"
      >
        {pages.map((pageItems, i) => (
          <div key={i} className="w-full shrink-0 snap-center">
            <div className="grid grid-cols-2 gap-x-5 gap-y-8">
              {pageItems.map((program) => (
                <Fragment key={cardKey(program)}>
                  {renderCard(program)}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <SeminarCarouselDots
          count={pages.length}
          activeIndex={activeIndex}
          onSelect={scrollToSlide}
          label="세미나 페이지 넘기기"
          itemLabel={(i) => `${i + 1}페이지`}
        />
      )}
    </div>
  );
};

/**
 * 세미나 카드 페이저 — 데스크톱은 2×4 화살표 페이징, 모바일은 2×2 스와이프+도트.
 * 브레이크포인트마다 페이지 크기(8/4)가 달라 서버 페이지네이션 대신 전체를 받아
 * 클라이언트에서 슬라이스한다(useSeminarList가 넉넉한 size로 조회).
 */
const SeminarProgramPager = ({
  programs,
  renderCard,
}: {
  programs: ProgramInfo[];
  renderCard: RenderCard;
}) => (
  <>
    <DesktopPagedGrid programs={programs} renderCard={renderCard} />
    <MobileSwipeCarousel programs={programs} renderCard={renderCard} />
  </>
);

export default SeminarProgramPager;
