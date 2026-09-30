import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import type { PassCalendarEvent, PassParticipationStatus } from '../../../types';
import {
  compareEvents,
  Day,
  eventEnd,
  eventStart,
  isBarEvent,
  MAX_ROWS,
  overlapsDay,
  VISIBLE_ITEMS,
  weekStartOf,
} from './calendarUtils';

/** 당일 일정의 배치 결과: 어느 행(lane)에 놓을지 */
export interface PointPlacement {
  event: PassCalendarEvent;
  lane: number;
}

/**
 * U-1 캘린더 상태·파생 데이터. 데스크탑/모바일 뷰가 공유한다.
 * (창은 오늘이 속한 월요일주 기준 2주. 이동은 1주씩.)
 *
 * 노출 규칙(방법 D):
 * - 기간 막대(여러 날)는 자기들끼리만 lane 패킹 → 항상 표시(안 끊김).
 * - 당일 일정(칩)은 날짜별로 남는 행에 채우고, 한 칸이 7개를 넘으면
 *   6개까지만 표시하고 나머지는 마지막 행에 +N 배지로 접는다.
 */
export function useCalendar(events: PassCalendarEvent[]) {
  const today = dayjs().startOf('day');
  const [windowStart, setWindowStart] = useState<Day>(weekStartOf(today));
  const [selected, setSelected] = useState<Day>(today);
  const [filters, setFilters] = useState<
    Record<PassParticipationStatus, boolean>
  >({ BEFORE: true, IN_PROGRESS: true, DONE: false });

  const windowEnd = windowStart.add(13, 'day');

  // 상태 필터 (세미나/마일스톤 등 status 없는 일정은 항상 노출)
  const filtered = useMemo(
    () => events.filter((e) => (e.status ? filters[e.status] : true)),
    [events, filters],
  );

  // 기간 막대 / 당일 일정 분리
  const bars = useMemo(
    () => filtered.filter(isBarEvent).sort(compareEvents),
    [filtered],
  );
  const points = useMemo(
    () => filtered.filter((e) => !isBarEvent(e)),
    [filtered],
  );

  // 막대끼리만 greedy lane 패킹 (기간 겹치면 다음 행). 막대는 항상 표시
  const barLaneOf = useMemo(() => {
    const laneEnds: number[] = [];
    const map = new Map<number, number>();
    for (const e of bars) {
      const s = eventStart(e).valueOf();
      let lane = laneEnds.findIndex((end) => s > end);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = eventEnd(e).valueOf();
      map.set(e.id, lane);
    }
    return map;
  }, [bars]);

  // 날짜별 시작하는 당일 일정
  const pointsOfDay = useMemo(() => {
    const m = new Map<string, PassCalendarEvent[]>();
    for (const p of points) {
      const key = eventStart(p).format('YYYY-MM-DD');
      const arr = m.get(key);
      if (arr) arr.push(p);
      else m.set(key, [p]);
    }
    for (const arr of m.values()) arr.sort(compareEvents);
    return m;
  }, [points]);

  // 날짜별 당일 일정 배치(남는 행 채우기) + 오버플로(+N) 집계
  const { pointsByDate, badgeByDate } = useMemo(() => {
    const placedMap = new Map<string, PointPlacement[]>();
    const badges = new Map<string, number>();

    for (let i = 0; i < 14; i += 1) {
      const day = windowStart.add(i, 'day');
      const key = day.format('YYYY-MM-DD');

      const dayBars = bars.filter((b) => overlapsDay(b, day));
      const occupied = new Set(dayBars.map((b) => barLaneOf.get(b.id)));
      const dayPoints = pointsOfDay.get(key) ?? [];
      const total = dayBars.length + dayPoints.length;

      // 7개 이하: 전부 표시 / 초과: 6개까지만 표시(막대 포함), 나머지 +N
      const cap = total <= MAX_ROWS ? MAX_ROWS : VISIBLE_ITEMS;
      const placed: PointPlacement[] = [];
      let overflow = 0;
      let cursor = 0;
      const nextFreeLane = () => {
        while (occupied.has(cursor)) cursor += 1;
        return cursor;
      };

      for (const p of dayPoints) {
        const lane = nextFreeLane();
        // 표시 한도(cap) 안이면 배치, 넘으면 접기
        if (dayBars.length + placed.length < cap && lane < cap) {
          occupied.add(lane);
          placed.push({ event: p, lane });
        } else {
          overflow += 1;
        }
      }

      if (placed.length) placedMap.set(key, placed);
      if (overflow > 0) badges.set(key, overflow);
    }

    return { pointsByDate: placedMap, badgeByDate: badges };
  }, [bars, barLaneOf, pointsOfDay, windowStart]);

  const mainMonthKey = useMemo(() => {
    const counts = new Map<string, number>();
    for (let i = 0; i < 14; i += 1) {
      const k = windowStart.add(i, 'day').format('YYYY-MM');
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1])[0][0];
  }, [windowStart]);

  const weeks = useMemo(
    () =>
      Array.from({ length: 2 }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => windowStart.add(w * 7 + d, 'day')),
      ),
    [windowStart],
  );

  // 우측 패널: 선택일에 걸치는 일정 전부 (우선순위 순, 오버플로와 무관)
  const selectedEvents = useMemo(
    () => filtered.filter((e) => overlapsDay(e, selected)).sort(compareEvents),
    [filtered, selected],
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
