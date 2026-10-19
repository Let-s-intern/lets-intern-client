// 데스크탑 캘린더 상태 훅 — 2주 창 이동·필터·이용기간 바운드
import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import type {
  PassCalendarEvent,
  PassParticipationStatus,
} from '../../../types';
import { deriveCalendar } from './calendarModel';
import {
  Day,
  MAX_ROWS,
  normalizeEvents,
  overlapsDay,
  VISIBLE_ITEMS,
  weekStartOf,
} from './calendarUtils';

/**
 * U-1 캘린더(데스크탑) 상태·파생 데이터.
 * 창은 오늘이 속한 월요일주 기준 2주, 이동은 1주씩.
 * 노출 규칙(방법 D)은 {@link deriveCalendar} 참고.
 */
export function useCalendar(
  events: PassCalendarEvent[],
  periodStart?: string,
  periodEnd?: string,
) {
  const today = useMemo(() => dayjs().startOf('day'), []);

  // 이용기간 바운드 — 이 범위(2주 창)만 이동 가능. 창은 2주라 마지막 창 시작은 종료주 -1주
  const minWindowStart = periodStart
    ? weekStartOf(dayjs(periodStart))
    : undefined;
  const maxWindowStart = periodEnd
    ? (() => {
        const m = weekStartOf(dayjs(periodEnd)).subtract(7, 'day');
        return minWindowStart && m.isBefore(minWindowStart)
          ? minWindowStart
          : m;
      })()
    : undefined;
  const clampWindow = (w: Day) => {
    if (minWindowStart && w.isBefore(minWindowStart)) return minWindowStart;
    if (maxWindowStart && w.isAfter(maxWindowStart)) return maxWindowStart;
    return w;
  };

  const [windowStart, setWindowStart] = useState<Day>(() =>
    clampWindow(weekStartOf(today)),
  );
  const [selected, setSelected] = useState<Day>(today);
  const [filters, setFilters] = useState<
    Record<PassParticipationStatus, boolean>
  >({ BEFORE: true, IN_PROGRESS: true, DONE: false });

  const windowEnd = windowStart.add(13, 'day');

  const weeks = useMemo(
    () =>
      Array.from({ length: 2 }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => windowStart.add(w * 7 + d, 'day')),
      ),
    [windowStart],
  );
  const days = useMemo(() => weeks.flat(), [weeks]);

  // 챌린지 status 를 challengeApplicationId + endDate 로 파생
  const normalized = useMemo(
    () => normalizeEvents(events, today),
    [events, today],
  );

  const { bars, barLaneOf, pointsByDate, badgeByDate } = useMemo(
    () =>
      deriveCalendar(normalized, filters, days, {
        maxRows: MAX_ROWS,
        visibleItems: VISIBLE_ITEMS,
      }),
    [normalized, filters, days],
  );

  const mainMonthKey = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of days) {
      const k = d.format('YYYY-MM');
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1])[0][0];
  }, [days]);

  // 우측 패널: 선택일에 걸치는 일정 전부 (필터 반영). 유형 무관 시작 시각 순
  const selectedEvents = useMemo(
    () =>
      normalized
        .filter((e) => (e.status ? filters[e.status] : true))
        .filter((e) => overlapsDay(e, selected))
        .sort(
          (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
        ),
    [normalized, filters, selected],
  );

  return {
    today,
    windowStart,
    windowEnd,
    weeks,
    mainMonthKey,
    selected,
    setSelected,
    filters,
    toggleFilter: (k: PassParticipationStatus) =>
      setFilters((f) => ({ ...f, [k]: !f[k] })),
    canPrevWeek: !minWindowStart || windowStart.isAfter(minWindowStart),
    canNextWeek: !maxWindowStart || windowStart.isBefore(maxWindowStart),
    goPrevWeek: () =>
      setWindowStart((w) => {
        const n = w.subtract(7, 'day');
        return minWindowStart && n.isBefore(minWindowStart) ? w : n;
      }),
    goNextWeek: () =>
      setWindowStart((w) => {
        const n = w.add(7, 'day');
        return maxWindowStart && n.isAfter(maxWindowStart) ? w : n;
      }),
    /** 오늘로 복귀 — 조회 창·선택일 모두 오늘 기준(이용기간 내로 클램프) */
    goToday: () => {
      setWindowStart(clampWindow(weekStartOf(today)));
      setSelected(today);
    },
    bars,
    barLaneOf,
    pointsByDate,
    badgeByDate,
    selectedEvents,
  };
}

export type CalendarState = ReturnType<typeof useCalendar>;
