import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import type { PassCalendarEvent, PassParticipationStatus } from '../../../types';
import { deriveCalendar } from './calendarModel';
import {
  compareEvents,
  Day,
  MAX_ROWS,
  overlapsDay,
  VISIBLE_ITEMS,
  weekStartOf,
} from './calendarUtils';

export type { PointPlacement } from './calendarModel';

/**
 * U-1 캘린더(데스크탑) 상태·파생 데이터.
 * 창은 오늘이 속한 월요일주 기준 2주, 이동은 1주씩.
 * 노출 규칙(방법 D)은 {@link deriveCalendar} 참고.
 */
export function useCalendar(events: PassCalendarEvent[]) {
  const today = dayjs().startOf('day');
  const [windowStart, setWindowStart] = useState<Day>(weekStartOf(today));
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

  const { bars, barLaneOf, pointsByDate, badgeByDate } = useMemo(
    () =>
      deriveCalendar(events, filters, days, {
        maxRows: MAX_ROWS,
        visibleItems: VISIBLE_ITEMS,
      }),
    [events, filters, days],
  );

  const mainMonthKey = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of days) {
      const k = d.format('YYYY-MM');
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1])[0][0];
  }, [days]);

  // 우측 패널: 선택일에 걸치는 일정 전부 (필터 반영, 우선순위 순, 오버플로와 무관)
  const selectedEvents = useMemo(
    () =>
      events
        .filter((e) => (e.status ? filters[e.status] : true))
        .filter((e) => overlapsDay(e, selected))
        .sort(compareEvents),
    [events, filters, selected],
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
    goPrevWeek: () => setWindowStart((w) => w.subtract(7, 'day')),
    goNextWeek: () => setWindowStart((w) => w.add(7, 'day')),
    bars,
    barLaneOf,
    pointsByDate,
    badgeByDate,
    selectedEvents,
  };
}

export type CalendarState = ReturnType<typeof useCalendar>;
