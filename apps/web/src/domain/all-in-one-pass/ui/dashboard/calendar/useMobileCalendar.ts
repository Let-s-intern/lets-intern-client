// 모바일 캘린더 상태 훅 — 주간/월간·주 인덱스·월 이동·필터
import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import type {
  PassCalendarEvent,
  PassParticipationStatus,
} from '../../../types';
import { deriveCalendar } from './calendarModel';
import {
  Day,
  MONTH_MAX_ROWS,
  MONTH_VISIBLE_ITEMS,
  normalizeEvents,
  overlapsDay,
  weekStartOf,
} from './calendarUtils';

export type CalendarView = 'week' | 'month';

interface Params {
  events: PassCalendarEvent[];
  periodStart?: string;
  periodEnd?: string;
}

export function useMobileCalendar({ events, periodStart, periodEnd }: Params) {
  const today = useMemo(() => dayjs().startOf('day'), []);
  const [view, setView] = useState<CalendarView>('week');
  const [selected, setSelected] = useState<Day>(today);
  const [monthAnchor, setMonthAnchor] = useState<Day>(today.startOf('month'));
  const [filters, setFilters] = useState<
    Record<PassParticipationStatus, boolean>
  >({ BEFORE: true, IN_PROGRESS: true, DONE: false });

  const monthWeeks = useMemo(() => {
    const gridStart = weekStartOf(monthAnchor.startOf('month'));
    const gridEnd = weekStartOf(monthAnchor.endOf('month')).add(6, 'day');
    const len = gridEnd.diff(gridStart, 'day') + 1;
    const days = Array.from({ length: len }, (_, i) => gridStart.add(i, 'day'));
    const rows: Day[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [monthAnchor]);

  const weeks = useMemo(() => {
    const start = weekStartOf(
      periodStart ? dayjs(periodStart) : today.subtract(4, 'week'),
    );
    const end = weekStartOf(
      periodEnd ? dayjs(periodEnd) : today.add(8, 'week'),
    );
    const count = Math.max(1, Math.round(end.diff(start, 'day') / 7) + 1);
    return Array.from({ length: count }, (_, i) =>
      Array.from({ length: 7 }, (_, d) => start.add(i * 7 + d, 'day')),
    );
  }, [periodStart, periodEnd, today]);

  const weekIndexOf = (d: Day) =>
    weeks.findIndex((w) => !d.isBefore(w[0]) && !d.isAfter(w[6]));

  const [weekIndex, setWeekIndex] = useState(() =>
    Math.max(0, weekIndexOf(today)),
  );

  const days = useMemo(
    () => (view === 'month' ? monthWeeks : weeks).flat(),
    [view, monthWeeks, weeks],
  );
  const normalized = useMemo(
    () => normalizeEvents(events, today),
    [events, today],
  );

  const model = useMemo(
    () =>
      deriveCalendar(normalized, filters, days, {
        maxRows: MONTH_MAX_ROWS,
        visibleItems: MONTH_VISIBLE_ITEMS,
      }),
    [normalized, filters, days],
  );

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

  const minMonth = periodStart
    ? dayjs(periodStart).startOf('month')
    : undefined;
  const maxMonth = periodEnd ? dayjs(periodEnd).startOf('month') : undefined;
  const canPrevMonth = !minMonth || monthAnchor.isAfter(minMonth, 'month');
  const canNextMonth = !maxMonth || monthAnchor.isBefore(maxMonth, 'month');

  return {
    today,
    view,
    setView: (v: CalendarView) => {
      if (v === 'month') setMonthAnchor(selected.startOf('month'));
      else {
        const idx = weekIndexOf(selected);
        if (idx >= 0) setWeekIndex(idx);
      }
      setView(v);
    },
    selected,
    setSelected,
    jumpTo: (d: Day) => {
      const day = d.startOf('day');
      setSelected(day);
      setMonthAnchor(day.startOf('month'));
      const idx = weekIndexOf(day);
      if (idx >= 0) setWeekIndex(idx);
    },
    goToday: () => {
      setSelected(today);
      setMonthAnchor(today.startOf('month'));
      const idx = weekIndexOf(today);
      if (idx >= 0) setWeekIndex(idx);
    },
    filters,
    toggleFilter: (k: PassParticipationStatus) =>
      setFilters((f) => ({ ...f, [k]: !f[k] })),
    monthAnchor,
    monthWeeks,
    goPrevMonth: () => {
      if (!canPrevMonth) return;
      const m = monthAnchor.subtract(1, 'month');
      setMonthAnchor(m);
      setSelected(m.startOf('month')); // 목록도 새 달로 따라감
    },
    goNextMonth: () => {
      if (!canNextMonth) return;
      const m = monthAnchor.add(1, 'month');
      setMonthAnchor(m);
      setSelected(m.startOf('month'));
    },
    canPrevMonth,
    canNextMonth,
    weeks,
    weekIndex,
    setWeekIndex,
    goPrevWeek: () => setWeekIndex((i) => Math.max(0, i - 1)),
    goNextWeek: () => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1)),
    canPrevWeek: weekIndex > 0,
    canNextWeek: weekIndex < weeks.length - 1,
    ...model,
    selectedEvents,
    periodStart,
    periodEnd,
  };
}

export type MobileCalendarState = ReturnType<typeof useMobileCalendar>;
