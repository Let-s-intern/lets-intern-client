import { differenceInCalendarDays, getMonth, isSameDay } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

import ChallengePeriodBar from '../calendar-bar/ui/ChallengePeriodBar';
import type { PeriodBarData } from '../types';
import { CompactFeedbackCard } from '../calendar-bar/ui/FeedbackCard';
import TodayButton from './ui/TodayButton';
import DayHeaderCell from './ui/DayHeaderCell';
import ColumnDividers from './ui/ColumnDividers';
import { useTimelineScroll } from './hooks/useInfiniteWeekScroll';

interface WeeklyCalendarProps {
  bars: PeriodBarData[];
  allBars: PeriodBarData[];
  onBarClick: (challengeId: number, missionId: number) => void;
  targetScrollDate?: Date | null;
}

const WeeklyCalendar = ({
  bars,
  allBars,
  onBarClick,
  targetScrollDate,
}: WeeklyCalendarProps) => {
  const {
    containerRef,
    timelineStart,
    totalDays,
    days,
    scrollToDate,
    scrollToToday,
  } = useTimelineScroll({ allBars });

  const today = useMemo(() => new Date(), []);
  const todayColRef = useRef<HTMLDivElement>(null);
  const [isTodayVisible, setIsTodayVisible] = useState(true);

  // Observe today column visibility within the scroll container
  useEffect(() => {
    const el = todayColRef.current;
    const root = containerRef.current;
    if (!el || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsTodayVisible(entry.isIntersecting),
      { root, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, days]);

  // External scroll request (tag click)
  useEffect(() => {
    if (targetScrollDate) {
      scrollToDate(targetScrollDate);
    }
  }, [targetScrollDate, scrollToDate]);

  // Bar layouts relative to the timeline
  const barLayouts = useMemo(() => {
    return bars
      .map((bar) => {
        const startCol =
          differenceInCalendarDays(new Date(bar.startDate), timelineStart) + 1;
        const endCol =
          differenceInCalendarDays(
            new Date(bar.feedbackDeadline),
            timelineStart,
          ) + 2;
        const colSpan = endCol - startCol;
        return { bar, startCol, endCol, colSpan };
      })
      .filter((l) => l.endCol >= 1 && l.startCol <= totalDays);
  }, [bars, timelineStart, totalDays]);

  // Fixed body height based on ALL bars so filtering doesn't shrink calendar
  const bodyMinHeight = useMemo(() => {
    const ROW_HEIGHT = 70;
    const MIN_ROWS = 3;
    const PADDING = 24;
    const rows = Math.max(allBars.length, MIN_ROWS);
    return rows * ROW_HEIGHT + PADDING;
  }, [allBars.length]);

  const innerWidthPercent = (totalDays / 7) * 100;
  const gridCols = `repeat(${totalDays}, 1fr)`;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden rounded-2xl border border-neutral-80"
      >
        <div
          style={{
            width: `${innerWidthPercent}%`,
            minWidth: `${totalDays * 140}px`,
          }}
        >
          {/* Day header */}
          <div
            className="border-b border-neutral-80"
            style={{ display: 'grid', gridTemplateColumns: gridCols }}
          >
            {days.map((day, i) => (
              <DayHeaderCell
                key={i}
                ref={isSameDay(day, today) ? todayColRef : undefined}
                day={day}
                today={today}
                isMonthStart={
                  i > 0 && getMonth(day) !== getMonth(days[i - 1])
                }
              />
            ))}
          </div>

          {/* Body */}
          <div
            className="relative"
            style={{ minHeight: `${bodyMinHeight}px` }}
          >
            <ColumnDividers days={days} gridCols={gridCols} />

            {/* Bars */}
            <div
              className="relative gap-y-1 py-3"
              style={{ display: 'grid', gridTemplateColumns: gridCols }}
            >
              {barLayouts.map(
                ({ bar, startCol, endCol, colSpan }, idx) => (
                  <div
                    key={`${bar.challengeId}-${bar.missionId}-${idx}`}
                    className="px-px"
                    style={{ gridColumn: `${startCol} / ${endCol}` }}
                  >
                    {colSpan <= 1 ? (
                      <CompactFeedbackCard
                        bar={bar}
                        onBarClick={onBarClick}
                      />
                    ) : (
                      <ChallengePeriodBar
                        bar={bar}
                        onBarClick={onBarClick}
                      />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state overlay */}
      {barLayouts.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60">
          <div className="pointer-events-auto rounded-xl border border-neutral-80 bg-white px-8 py-6 shadow-lg">
            <p className="text-center text-xsmall16 font-medium text-neutral-30">
              진행 예정인 피드백 일정이 없습니다.
            </p>
          </div>
        </div>
      )}

      <TodayButton
        isTodayVisible={isTodayVisible}
        onGoToToday={scrollToToday}
      />
    </div>
  );
};

export default WeeklyCalendar;
