import { useMemo } from 'react';

/** Minimum number of bar rows to reserve space for */
const MIN_ROWS = 3;
/** Height per bar row in pixels */
const ROW_HEIGHT = 52;
/** Vertical padding for the bar area */
const PADDING_Y = 56; // py-7 = 28px * 2

interface UseCalendarLayoutReturn {
  /** Fixed minimum height for the calendar body area (px) */
  bodyMinHeight: number;
}

/**
 * Computes a fixed layout height for the calendar body area.
 * Ensures consistent height regardless of how many bars are visible
 * or whether challenge filters are applied.
 *
 * The height accommodates at least MIN_ROWS bars to prevent layout shifts.
 */
export function useCalendarLayout(visibleBarCount: number): UseCalendarLayoutReturn {
  const bodyMinHeight = useMemo(() => {
    const rows = Math.max(visibleBarCount, MIN_ROWS);
    return rows * ROW_HEIGHT + PADDING_Y;
  }, [visibleBarCount]);

  return { bodyMinHeight };
}
