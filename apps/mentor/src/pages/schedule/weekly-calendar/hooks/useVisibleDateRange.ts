import { useEffect, useState, type RefObject } from 'react';
import { addDays } from 'date-fns';

export interface VisibleRange {
  /** 뷰포트 왼쪽 끝에 보이는 첫 날짜 */
  firstVisibleDate: Date;
  /** 뷰포트 오른쪽 끝에 보이는 마지막 날짜 */
  lastVisibleDate: Date;
}

interface ComputeVisibleRangeArgs {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
  timelineStart: Date;
  totalDays: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 스크롤 위치 → 뷰포트에 보이는 날짜 범위(시작~끝)를 계산하는 순수 함수.
 *
 * 무한스크롤 타임라인은 하루당 `scrollWidth / totalDays` px 폭을 가진다.
 * 레이아웃 전(`scrollWidth = 0`)이거나 데이터가 없으면 `null`.
 */
export function computeVisibleRange({
  scrollLeft,
  scrollWidth,
  clientWidth,
  timelineStart,
  totalDays,
}: ComputeVisibleRangeArgs): VisibleRange | null {
  if (scrollWidth <= 0 || totalDays <= 0) return null;

  const dayWidth = scrollWidth / totalDays;
  if (dayWidth <= 0) return null;

  // round 기준 — 왼쪽 끝에 절반 이상 걸친 날짜를 "첫 날"로 본다.
  // (주 이동 버튼이 같은 round 기준으로 스크롤하므로 라벨과 버튼이 정확히 일치한다)
  const firstIdx = clamp(Math.round(scrollLeft / dayWidth), 0, totalDays - 1);
  const visibleDays = Math.max(1, Math.round(clientWidth / dayWidth));
  const lastIdx = clamp(firstIdx + visibleDays - 1, 0, totalDays - 1);

  return {
    firstVisibleDate: addDays(timelineStart, firstIdx),
    lastVisibleDate: addDays(timelineStart, lastIdx),
  };
}

/**
 * 무한스크롤 캘린더 컨테이너의 스크롤 위치를 읽어 현재 보이는 날짜 범위를 반환한다.
 *
 * ⚠️ 읽기 전용 — 스크롤 동작/레이아웃에는 관여하지 않고 위치만 관찰한다.
 * scroll·resize 시 rAF 디바운스로 갱신하며, 타임라인(`timelineStart`/`totalDays`)이
 * 재계산되면(데이터 로드) 다시 측정한다.
 */
export function useVisibleDateRange(
  containerRef: RefObject<HTMLDivElement | null>,
  timelineStart: Date,
  totalDays: number,
): VisibleRange | null {
  const [range, setRange] = useState<VisibleRange | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setRange(
          computeVisibleRange({
            scrollLeft: el.scrollLeft,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            timelineStart,
            totalDays,
          }),
        );
      });
    };

    update();
    el.addEventListener('scroll', update, { passive: true });

    // ResizeObserver 미지원 환경(일부 테스트 jsdom 등)에서는 scroll 갱신만 사용.
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resizeObserver?.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', update);
      resizeObserver?.disconnect();
    };
  }, [containerRef, timelineStart, totalDays]);

  return range;
}
