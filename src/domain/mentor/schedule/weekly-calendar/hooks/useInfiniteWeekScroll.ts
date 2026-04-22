import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  addDays,
  differenceInCalendarDays,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import type { PeriodBarData } from '../../types';

interface UseTimelineScrollOptions {
  allBars: PeriodBarData[];
}

/**
 * Continuous horizontal timeline scroll.
 *
 * Calculates the date range from all bars, renders one column per day,
 * and provides smooth native scrolling. 7 days = 1 viewport width.
 */
export function useTimelineScroll({ allBars }: UseTimelineScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const hasScrolledRef = useRef(false);

  const { timelineStart, totalDays, days } = useMemo(() => {
    if (allBars.length === 0) {
      const today = startOfWeek(new Date(), { weekStartsOn: 1 });
      const start = addDays(today, -7);
      const total = 28;
      return {
        timelineStart: start,
        totalDays: total,
        days: Array.from({ length: total }, (_, i) => addDays(start, i)),
      };
    }

    let minDate = new Date(allBars[0].startDate);
    let maxDate = new Date(allBars[0].feedbackDeadline);
    for (const bar of allBars) {
      const s = new Date(bar.startDate);
      const e = new Date(bar.feedbackDeadline);
      if (s < minDate) minDate = s;
      if (e > maxDate) maxDate = e;
    }

    const start = startOfWeek(addDays(minDate, -14), { weekStartsOn: 1 });
    const end = addDays(
      startOfWeek(addDays(maxDate, 14), { weekStartsOn: 1 }),
      6,
    );
    const total = differenceInCalendarDays(end, start) + 1;

    return {
      timelineStart: start,
      totalDays: total,
      days: Array.from({ length: total }, (_, i) => addDays(start, i)),
    };
  }, [allBars]);

  const scrollToDate = useCallback(
    (date: Date, behavior: ScrollBehavior = 'smooth') => {
      const el = containerRef.current;
      if (!el || el.scrollWidth === 0) return;
      const idx = differenceInCalendarDays(startOfDay(date), timelineStart);
      const dayWidth = el.scrollWidth / totalDays;
      // Center the target date in the viewport
      const targetLeft = idx * dayWidth - el.clientWidth / 2 + dayWidth / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        behavior,
      });
    },
    [timelineStart, totalDays],
  );

  // Scroll to today whenever timeline range recalculates (data loads)
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has rendered the new width
    const raf = requestAnimationFrame(() => {
      const behavior: ScrollBehavior = hasScrolledRef.current
        ? 'smooth'
        : 'instant';
      scrollToDate(new Date(), behavior);
      hasScrolledRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [scrollToDate]);

  const scrollToToday = useCallback(() => {
    scrollToDate(new Date(), 'smooth');
  }, [scrollToDate]);

  return {
    containerRef,
    timelineStart,
    totalDays,
    days,
    scrollToDate,
    scrollToToday,
  };
}
