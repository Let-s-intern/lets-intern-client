import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import type { PassCalendarEvent, PassParticipationStatus } from '../../../types';
import { deriveCalendar } from './calendarModel';
import {
  compareEvents,
  Day,
  MONTH_MAX_ROWS,
  MONTH_VISIBLE_ITEMS,
  overlapsDay,
  weekStartOf,
} from './calendarUtils';

export type CalendarView = 'week' | 'month';

interface Params {
  events: PassCalendarEvent[];
  /** 패스 기간 — 월 이동 경계 및 날짜 피커 노출 범위 */
  periodStart?: string;
  periodEnd?: string;
}

/**
 * U-1 캘린더(모바일) 상태·파생 데이터.
 * - 주간: 패스 기간 내 주(월요일)들을 좌우로 스와이프. 헤더 월은 선택일 기준.
 * - 월간: 한 달 그리드를 화살표로 이동. 헤더 월은 기준 달.
 * 노출 규칙(방법 D)은 {@link deriveCalendar} 참고(월간은 한 칸 4행 = 3 + 배지).
 */
export function useMobileCalendar({ events, periodStart, periodEnd }: Params) {
  const today = dayjs().startOf('day');
  const [view, setView] = useState<CalendarView>('week');
  const [selected, setSelected] = useState<Day>(today);
  const [monthAnchor, setMonthAnchor] = useState<Day>(today.startOf('month'));
  const [filters, setFilters] = useState<
    Record<PassParticipationStatus, boolean>
  >({ BEFORE: true, IN_PROGRESS: true, DONE: false });

  // 월간 그리드 날짜 (월요일 시작, 달 전체를 덮는 주 단위)
  const monthWeeks = useMemo(() => {
    const gridStart = weekStartOf(monthAnchor.startOf('month'));
    const gridEnd = weekStartOf(monthAnchor.endOf('month')).add(6, 'day');
    const len = gridEnd.diff(gridStart, 'day') + 1;
    const days = Array.from({ length: len }, (_, i) => gridStart.add(i, 'day'));
    const rows: Day[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [monthAnchor]);

  // 주간 리본: 패스 기간(없으면 오늘 ±주)의 주(월요일) 목록
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

  // 선택일이 속한 주 인덱스 찾기
  const weekIndexOf = (d: Day) =>
    weeks.findIndex((w) => !d.isBefore(w[0]) && !d.isAfter(w[6]));

  // 주간 리본에서 현재 보이는 주 (스와이프/화살표로 이동)
  const [weekIndex, setWeekIndex] = useState(() =>
    Math.max(0, weekIndexOf(today)),
  );

  // 모델 계산 대상 날짜 + 캡 (뷰별)
  const days = useMemo(
    () => (view === 'month' ? monthWeeks : weeks).flat(),
    [view, monthWeeks, weeks],
  );
  // 주간·월간 동일: 4개까지 표시, 5개 이상이면 3개 + +N
  const model = useMemo(
    () =>
      deriveCalendar(events, filters, days, {
        maxRows: MONTH_MAX_ROWS,
        visibleItems: MONTH_VISIBLE_ITEMS,
      }),
    [events, filters, days],
  );

  // 하단 목록: 선택일에 걸치는 일정 전부 (필터 반영, 우선순위 순)
  const selectedEvents = useMemo(
    () =>
      events
        .filter((e) => (e.status ? filters[e.status] : true))
        .filter((e) => overlapsDay(e, selected))
        .sort(compareEvents),
    [events, filters, selected],
  );

  // 월 이동 경계 (패스 기간 내)
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
    /** 날짜 피커 확정 — 선택일 이동 + 기준 달/주 동기화 */
    jumpTo: (d: Day) => {
      const day = d.startOf('day');
      setSelected(day);
      setMonthAnchor(day.startOf('month'));
      const idx = weekIndexOf(day);
      if (idx >= 0) setWeekIndex(idx);
    },
    /** 오늘로 복귀 — 선택일·기준 달·주 모두 오늘로 */
    goToday: () => {
      setSelected(today);
      setMonthAnchor(today.startOf('month'));
      const idx = weekIndexOf(today);
      if (idx >= 0) setWeekIndex(idx);
    },
    filters,
    toggleFilter: (k: PassParticipationStatus) =>
      setFilters((f) => ({ ...f, [k]: !f[k] })),
    // 월간
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
    // 주간
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
