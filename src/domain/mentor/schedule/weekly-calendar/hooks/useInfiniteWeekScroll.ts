import { useCallback, useRef, useState } from 'react';
import { addDays, startOfWeek } from 'date-fns';

const SWIPE_THRESHOLD = 50;

interface UseInfiniteWeekScrollOptions {
  /** Current week start date */
  weekStartDate: Date;
  /** Callback when the week changes */
  onWeekChange: (date: Date) => void;
}

interface UseInfiniteWeekScrollReturn {
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Current drag offset (px) for transform animation */
  dragOffset: number;
  /** Whether the user is currently dragging */
  isDragging: boolean;
  /** Touch/pointer event handlers */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  /** Navigate to previous week */
  goToPrevWeek: () => void;
  /** Navigate to next week */
  goToNextWeek: () => void;
  /** Navigate to the week containing today */
  goToCurrentWeek: () => void;
}

/**
 * Manages horizontal swipe/drag gestures for infinite week navigation.
 * Supports both touch and mouse pointer events.
 */
export function useInfiniteWeekScroll({
  weekStartDate,
  onWeekChange,
}: UseInfiniteWeekScrollOptions): UseInfiniteWeekScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Mutable refs for tracking drag state without re-renders
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);

  const goToPrevWeek = useCallback(() => {
    onWeekChange(addDays(weekStartDate, -7));
  }, [weekStartDate, onWeekChange]);

  const goToNextWeek = useCallback(() => {
    onWeekChange(addDays(weekStartDate, 7));
  }, [weekStartDate, onWeekChange]);

  const goToCurrentWeek = useCallback(() => {
    onWeekChange(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, [onWeekChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only track primary pointer (left mouse / first touch)
    if (e.button !== 0) return;
    activePointerRef.current = e.pointerId;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);

    // Capture pointer for smooth tracking outside container
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (activePointerRef.current !== e.pointerId) return;
    currentXRef.current = e.clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  }, []);

  const finishDrag = useCallback(() => {
    const diff = currentXRef.current - startXRef.current;
    activePointerRef.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Swiped right -> previous week
        goToPrevWeek();
      } else {
        // Swiped left -> next week
        goToNextWeek();
      }
    }
  }, [goToPrevWeek, goToNextWeek]);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (activePointerRef.current !== e.pointerId) return;
      finishDrag();
    },
    [finishDrag],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (activePointerRef.current !== e.pointerId) return;
      activePointerRef.current = null;
      setIsDragging(false);
      setDragOffset(0);
    },
    [],
  );

  return {
    containerRef,
    dragOffset,
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}
