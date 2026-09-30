import type {
  PassCalendarEvent,
  PassParticipationStatus,
} from '../../../types';
import {
  compareEvents,
  Day,
  eventEnd,
  eventStart,
  isBarEvent,
  overlapsDay,
} from './calendarUtils';

/** 당일 일정의 배치 결과: 어느 행(lane)에 놓을지 */
export interface PointPlacement {
  event: PassCalendarEvent;
  lane: number;
}

export interface CalendarModel {
  /** 기간 막대 (우선순위 정렬됨) */
  bars: PassCalendarEvent[];
  /** 막대 id → 행(lane) */
  barLaneOf: Map<number, number>;
  /** 날짜(YYYY-MM-DD) → 당일 칩 배치 */
  pointsByDate: Map<string, PointPlacement[]>;
  /** 날짜(YYYY-MM-DD) → 오버플로 개수(+N) */
  badgeByDate: Map<string, number>;
}

/**
 * 캘린더 노출 모델(방법 D) — 데스크탑·모바일(주간/월간) 공용.
 * - 기간 막대(여러 날)는 자기들끼리만 lane 패킹 → 항상 표시(안 끊김).
 * - 당일 일정(칩)은 날짜별로 남는 행에 채우고, 한 칸이 maxRows를 넘으면
 *   visibleItems개까지만 표시하고 나머지는 +N 배지로 접는다.
 *
 * @param days   배치를 계산할 날짜 목록(주간=7 / 2주=14 / 월간=한 달)
 * @param maxRows 한 칸 최대 행(이하면 전부 표시)
 * @param visibleItems 초과 시 표시할 개수(나머지는 +N)
 */
export function deriveCalendar(
  events: PassCalendarEvent[],
  filters: Record<PassParticipationStatus, boolean>,
  days: Day[],
  { maxRows, visibleItems }: { maxRows: number; visibleItems: number },
): CalendarModel {
  // 상태 필터 (세미나/마일스톤 등 status 없는 일정은 항상 노출)
  const filtered = events.filter((e) => (e.status ? filters[e.status] : true));

  // 기간 막대 / 당일 일정 분리
  const bars = filtered.filter(isBarEvent).sort(compareEvents);
  const points = filtered.filter((e) => !isBarEvent(e));

  // 막대끼리만 greedy lane 패킹 (기간 겹치면 다음 행). 막대는 항상 표시
  const barLaneOf = new Map<number, number>();
  const laneEnds: number[] = [];
  for (const e of bars) {
    const s = eventStart(e).valueOf();
    let lane = laneEnds.findIndex((end) => s > end);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = eventEnd(e).valueOf();
    barLaneOf.set(e.id, lane);
  }

  // 날짜별 시작하는 당일 일정
  const pointsOfDay = new Map<string, PassCalendarEvent[]>();
  for (const p of points) {
    const key = eventStart(p).format('YYYY-MM-DD');
    const arr = pointsOfDay.get(key);
    if (arr) arr.push(p);
    else pointsOfDay.set(key, [p]);
  }
  for (const arr of pointsOfDay.values()) arr.sort(compareEvents);

  // 날짜별 당일 일정 배치(남는 행 채우기) + 오버플로(+N) 집계
  const pointsByDate = new Map<string, PointPlacement[]>();
  const badgeByDate = new Map<string, number>();

  for (const day of days) {
    const key = day.format('YYYY-MM-DD');
    const dayBars = bars.filter((b) => overlapsDay(b, day));
    const occupied = new Set<number | undefined>(
      dayBars.map((b) => barLaneOf.get(b.id)),
    );
    const dayPoints = pointsOfDay.get(key) ?? [];
    const total = dayBars.length + dayPoints.length;

    // maxRows 이하: 전부 표시 / 초과: visibleItems까지만(막대 포함), 나머지 +N
    const cap = total <= maxRows ? maxRows : visibleItems;
    const placed: PointPlacement[] = [];
    let overflow = 0;
    let cursor = 0;
    const nextFreeLane = () => {
      while (occupied.has(cursor)) cursor += 1;
      return cursor;
    };

    for (const p of dayPoints) {
      const lane = nextFreeLane();
      if (dayBars.length + placed.length < cap && lane < cap) {
        occupied.add(lane);
        placed.push({ event: p, lane });
      } else {
        overflow += 1;
      }
    }

    if (placed.length) pointsByDate.set(key, placed);
    if (overflow > 0) badgeByDate.set(key, overflow);
  }

  return { bars, barLaneOf, pointsByDate, badgeByDate };
}
