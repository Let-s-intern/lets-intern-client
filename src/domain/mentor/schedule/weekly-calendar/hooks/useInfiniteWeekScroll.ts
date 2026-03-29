import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { addDays, startOfWeek } from 'date-fns';

const BUFFER = 2; // weeks on each side of center
const TOTAL_PANELS = BUFFER * 2 + 1; // 5 panels

interface UseInfiniteWeekScrollOptions {
  weekStartDate: Date;
  onWeekChange: (date: Date) => void;
}

/**
 * Truly smooth infinite horizontal scroll for weekly calendar.
 *
 * Renders 5 weeks side-by-side with native overflow scroll (no snap, no pagination).
 * When the user scrolls near the edges, shifts the week buffer and adjusts
 * scrollLeft before paint — so the scroll feels continuous and infinite.
 */
export function useInfiniteWeekScroll({
  weekStartDate,
  onWeekChange,
}: UseInfiniteWeekScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null!);
  // Non-zero when the scroll handler triggered a week shift (vs programmatic navigation)
  const scrollCompensateRef = useRef(0);
  const isAdjustingRef = useRef(false);

  const centerWeek = useMemo(
    () => startOfWeek(weekStartDate, { weekStartsOn: 1 }),
    [weekStartDate],
  );

  // Week start dates for all panels
  const weekDates = useMemo(
    () =>
      Array.from({ length: TOTAL_PANELS }, (_, i) =>
        addDays(centerWeek, (i - BUFFER) * 7),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [centerWeek.getTime()],
  );

  // After DOM update: adjust scroll position
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const panelWidth = el.clientWidth;

    if (scrollCompensateRef.current !== 0) {
      // User-driven scroll edge shift: compensate so user sees no jump
      el.scrollLeft += scrollCompensateRef.current * panelWidth;
      scrollCompensateRef.current = 0;
    } else {
      // Programmatic navigation (tag click, today button): center instantly
      el.scrollLeft = panelWidth * BUFFER;
    }

    // Brief lock to prevent the scroll handler from re-triggering
    isAdjustingRef.current = true;
    requestAnimationFrame(() => {
      isAdjustingRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerWeek.getTime()]);

  // Detect scroll near edges → shift buffer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const checkEdge = () => {
      if (isAdjustingRef.current) return;
      const panelWidth = el.clientWidth;
      if (panelWidth === 0) return;
      const scrollLeft = el.scrollLeft;

      if (scrollLeft < panelWidth * 0.5) {
        // Near left edge → shift center 1 week earlier
        scrollCompensateRef.current = 1;
        onWeekChange(addDays(weekStartDate, -7));
      } else if (scrollLeft > panelWidth * (TOTAL_PANELS - 1.5)) {
        // Near right edge → shift center 1 week later
        scrollCompensateRef.current = -1;
        onWeekChange(addDays(weekStartDate, 7));
      }
    };

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(checkEdge, 60);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [weekStartDate, onWeekChange]);

  const goToCurrentWeek = useCallback(() => {
    onWeekChange(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, [onWeekChange]);

  return { containerRef, weekDates, goToCurrentWeek };
}
