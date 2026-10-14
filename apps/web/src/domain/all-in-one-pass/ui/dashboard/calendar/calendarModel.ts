// 캘린더 노출 계산(방법 D) — deriveCalendar: 막대 lane 패킹 + 당일 배치 + +N
import type {
  NormalizedCalendarEvent,
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

export interface PointPlacement {
  event: NormalizedCalendarEvent;
  lane: number;
}

export interface CalendarModel {
  bars: NormalizedCalendarEvent[];
  barLaneOf: Map<number, number>;
  pointsByDate: Map<string, PointPlacement[]>;
  badgeByDate: Map<string, number>;
}

export function deriveCalendar(
  events: NormalizedCalendarEvent[],
  filters: Record<PassParticipationStatus, boolean>,
  days: Day[],
  { maxRows, visibleItems }: { maxRows: number; visibleItems: number },
): CalendarModel {
  const filtered = events.filter((e) => (e.status ? filters[e.status] : true));

  const bars = filtered.filter(isBarEvent).sort(compareEvents);
  const points = filtered.filter((e) => !isBarEvent(e));

  const barLaneOf = new Map<number, number>();
  const laneEnds: number[] = [];
  for (const e of bars) {
    const s = eventStart(e).valueOf();
    let lane = laneEnds.findIndex((end) => s > end);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = eventEnd(e).valueOf();
    barLaneOf.set(e.id, lane);
  }

  const pointsOfDay = new Map<string, NormalizedCalendarEvent[]>();
  for (const p of points) {
    const key = eventStart(p).format('YYYY-MM-DD');
    const arr = pointsOfDay.get(key);
    if (arr) arr.push(p);
    else pointsOfDay.set(key, [p]);
  }
  for (const arr of pointsOfDay.values()) arr.sort(compareEvents);

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
