import { format } from 'date-fns';
import { type RefObject } from 'react';

import type { VisibleRange } from '../hooks/useVisibleDateRange';

interface CalendarRangeHeaderProps {
  /** 현재 보이는 날짜 범위 (스크롤에 따라 갱신). 측정 전이면 null */
  range: VisibleRange | null;
  /** 무한스크롤 컨테이너 ref (주 이동 버튼이 직접 스크롤 위치를 옮긴다) */
  containerRef: RefObject<HTMLDivElement | null>;
  /** 타임라인 전체 일수 — 하루 폭(scrollWidth/totalDays) 계산용 */
  totalDays: number;
}

/** 주 이동 버튼이 한 번에 이동하는 일수 — 일주일(7일) */
const MOVE_STEP_DAYS = 7;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 캘린더 상단 고정 헤더 — 보이는 날짜 범위 라벨 + 주 이동(`<`,`>`) 버튼.
 *
 * - 라벨: 가로 스크롤에 따라 "YYYY.MM.DD ~ MM.DD" 로 실시간 갱신.
 * - 버튼: 현재 보이는 첫날 기준 일주일(7일) 앞/뒤로, **다음 주 첫날을 왼쪽 끝에 맞춰** 이동.
 *   (기존 `scrollToDate` 는 대상 날짜를 화면 중앙에 두므로 주 단위 이동에 부적합 → 직접 스크롤)
 *
 * ⚠️ 무한스크롤 자체 동작/레이아웃은 변경하지 않는다 — 컨테이너의 표준 스크롤 위치만 옮긴다.
 */
const CalendarRangeHeader = ({
  range,
  containerRef,
  totalDays,
}: CalendarRangeHeaderProps) => {
  const label = range
    ? `${format(range.firstVisibleDate, 'yyyy.MM.dd')} ~ ${format(
        range.lastVisibleDate,
        'MM.dd',
      )}`
    : '';

  const moveByDays = (deltaDays: number) => {
    const el = containerRef.current;
    if (!el || el.scrollWidth <= 0 || totalDays <= 0) return;

    const dayWidth = el.scrollWidth / totalDays;
    // 라벨과 동일한 round 기준 첫날 인덱스 → ±7일 한 뒤 그 날을 왼쪽 끝에 정렬.
    const currentFirstIdx = Math.round(el.scrollLeft / dayWidth);
    const targetIdx = clamp(currentFirstIdx + deltaDays, 0, totalDays - 1);
    el.scrollTo({ left: targetIdx * dayWidth, behavior: 'smooth' });
  };

  return (
    <div className="border-neutral-80 flex items-center justify-center gap-3 border-b px-3 py-2">
      <button
        type="button"
        onClick={() => moveByDays(-MOVE_STEP_DAYS)}
        disabled={!range}
        aria-label="이전 주"
        className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 9L10 13L14 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="text-xsmall14 text-neutral-10 min-w-[150px] text-center font-semibold tabular-nums">
        {label}
      </span>

      <button
        type="button"
        onClick={() => moveByDays(MOVE_STEP_DAYS)}
        disabled={!range}
        aria-label="다음 주"
        className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 9L14 13L10 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CalendarRangeHeader;
