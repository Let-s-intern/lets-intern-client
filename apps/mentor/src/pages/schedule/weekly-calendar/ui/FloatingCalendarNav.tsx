import { format } from 'date-fns';
import { useLayoutEffect, useState, type RefObject } from 'react';

import type { VisibleRange } from '../hooks/useVisibleDateRange';

interface FloatingCalendarNavProps {
  /** 현재 보이는 날짜 범위 (스크롤에 따라 갱신). 측정 전이면 null */
  range: VisibleRange | null;
  /** 무한스크롤 컨테이너 ref — 주 이동 스크롤 + 캘린더 가로 위치 측정에 쓴다 */
  containerRef: RefObject<HTMLDivElement | null>;
  /** 타임라인 전체 일수 — 하루 폭(scrollWidth/totalDays) 계산용 */
  totalDays: number;
  /** 오늘 컬럼이 현재 뷰포트에 보이는지 — 보일 때는 "오늘" 버튼을 숨긴다 */
  isTodayVisible: boolean;
  /** "오늘" 클릭 시 오늘로 스크롤 */
  onGoToToday: () => void;
}

/** 주 이동 버튼이 한 번에 이동하는 일수 — 일주일(7일) */
const MOVE_STEP_DAYS = 7;
/** 오늘 버튼을 캘린더 우측 끝에서 안쪽으로 띄우는 여백(px) */
const RIGHT_INSET = 16;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const TodayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="shrink-0"
  >
    <rect
      x="2"
      y="3"
      width="12"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M5.5 2V4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M10.5 2V4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * 캘린더 하단 플로팅 컨트롤 — **뷰포트 고정(fixed)**, 가로는 **캘린더 기준** 정렬.
 *
 * - `fixed` 이므로 페이지를 세로 스크롤해도 화면 하단에 계속 떠 있는다(캘린더와 함께 안 움직임).
 * - `fixed left-1/2`(뷰포트 중앙)는 사이드 여백이 있으면 캘린더 중앙과 어긋나므로,
 *   캘린더 컨테이너(`containerRef`)의 화면 좌표를 측정해 그 **가로 중앙**에 좌우이동 pill을,
 *   **우측 끝**에 "오늘" 버튼을 배치한다. (getBoundingClientRect 는 뷰포트 좌표 → fixed 와 정합)
 * - "오늘"은 우측 별도 버튼으로, 오늘 컬럼이 화면 밖일 때만 생겼다 사라진다.
 */
const FloatingCalendarNav = ({
  range,
  containerRef,
  totalDays,
  isTodayVisible,
  onGoToToday,
}: FloatingCalendarNavProps) => {
  const label = range
    ? `${format(range.firstVisibleDate, 'yyyy.MM.dd')} ~ ${format(
        range.lastVisibleDate,
        'MM.dd',
      )}`
    : '';

  // 캘린더의 화면상 가로 중앙 x / 우측 x (뷰포트 좌표). resize 때 재측정.
  const [box, setBox] = useState<{ centerX: number; rightX: number } | null>(
    null,
  );
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ centerX: r.left + r.width / 2, rightX: r.right });
    };
    measure();
    // ResizeObserver 미지원 환경(jsdom 등)에서도 안전하게.
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef]);

  const moveByDays = (deltaDays: number) => {
    const el = containerRef.current;
    if (!el || el.scrollWidth <= 0 || totalDays <= 0) return;

    const dayWidth = el.scrollWidth / totalDays;
    const currentFirstIdx = Math.round(el.scrollLeft / dayWidth);
    const targetIdx = clamp(currentFirstIdx + deltaDays, 0, totalDays - 1);
    el.scrollTo({ left: targetIdx * dayWidth, behavior: 'smooth' });
  };

  return (
    <>
      {/* ① 좌우 이동 + 날짜 범위 — 뷰포트 하단 고정, 가로는 캘린더 중앙 */}
      <div
        className="border-neutral-80 fixed bottom-6 left-1/2 z-40 flex h-10 -translate-x-1/2 items-center gap-1.5 rounded-full border bg-white px-2 shadow-lg"
        style={box ? { left: box.centerX } : undefined}
      >
        <button
          type="button"
          onClick={() => moveByDays(-MOVE_STEP_DAYS)}
          disabled={!range}
          aria-label="이전 주"
          className="hover:bg-neutral-95 flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
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

        <span className="text-xsmall14 text-neutral-10 min-w-[140px] text-center font-semibold tabular-nums">
          {label}
        </span>

        <button
          type="button"
          onClick={() => moveByDays(MOVE_STEP_DAYS)}
          disabled={!range}
          aria-label="다음 주"
          className="hover:bg-neutral-95 flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
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

      {/* ② "오늘" — 뷰포트 하단 고정, 캘린더 우측 끝. 오늘이 화면 밖일 때만 노출. */}
      {!isTodayVisible && (
        <button
          type="button"
          onClick={onGoToToday}
          aria-label="오늘로 이동"
          className="border-neutral-80 text-primary text-xsmall14 hover:bg-neutral-95 fixed bottom-6 right-6 z-40 flex h-10 items-center gap-1 whitespace-nowrap rounded-full border bg-white pl-3 pr-3.5 font-medium shadow-lg transition-colors"
          style={
            box
              ? {
                  left: box.rightX - RIGHT_INSET,
                  right: 'auto',
                  transform: 'translateX(-100%)',
                }
              : undefined
          }
        >
          <TodayIcon />
          오늘
        </button>
      )}
    </>
  );
};

export default FloatingCalendarNav;
