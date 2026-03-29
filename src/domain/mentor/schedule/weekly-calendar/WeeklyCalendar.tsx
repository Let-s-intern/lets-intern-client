'use client';

import {
  differenceInCalendarDays,
  format,
  getMonth,
  isSameDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ChallengePeriodBar, {
  type PeriodBarData,
} from '../challenge-period/ChallengePeriodBar';
import { CompactFeedbackCard } from '../challenge-period/FeedbackCard';
import TodayButton from './ui/TodayButton';
import { useTimelineScroll } from './hooks/useInfiniteWeekScroll';

const DAY_LABELS_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

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

  // External scroll request (tag click) — center the target date
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
          differenceInCalendarDays(new Date(bar.endDate), timelineStart) + 2;
        return { bar, startCol, endCol, colSpan: endCol - startCol };
      })
      .filter((l) => l.endCol >= 1 && l.startCol <= totalDays);
  }, [bars, timelineStart, totalDays]);

  // Fixed body height based on ALL bars (unfiltered) so filtering doesn't shrink calendar
  const bodyMinHeight = useMemo(() => {
    const ROW_HEIGHT = 70;
    const MIN_ROWS = 3;
    const PADDING = 24; // py-3 = 12*2
    const rows = Math.max(allBars.length, MIN_ROWS);
    return rows * ROW_HEIGHT + PADDING;
  }, [allBars.length]);

  const innerWidthPercent = (totalDays / 7) * 100;
  const gridCols = `repeat(${totalDays}, 1fr)`;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-x-auto rounded-2xl border border-neutral-80"
      >
        <div
          style={{
            width: `${innerWidthPercent}%`,
            minWidth: `${totalDays * 92}px`,
          }}
        >
          {/* Day header */}
          <div
            className="border-b border-neutral-80"
            style={{ display: 'grid', gridTemplateColumns: gridCols }}
          >
            {days.map((day, i) => {
              const isToday = isSameDay(day, today);
              const isSunday = day.getDay() === 0;
              const isMonthStart =
                i > 0 && getMonth(day) !== getMonth(days[i - 1]);

              return (
                <div
                  key={i}
                  ref={isToday ? todayColRef : undefined}
                  className={`flex flex-col items-center justify-center gap-1 py-2 ${
                    isMonthStart ? 'border-l-2 border-primary-20' : ''
                  }`}
                >
                  {isMonthStart && (
                    <span className="rounded-full bg-primary-10 px-1.5 py-0.5 text-[10px] font-semibold text-primary-dark">
                      {format(day, 'M월', { locale: ko })}
                    </span>
                  )}
                  <span
                    className={`text-xsmall14 font-medium ${
                      isSunday
                        ? 'text-[#dd1900]'
                        : isToday
                          ? 'text-neutral-40'
                          : 'text-neutral-10'
                    }`}
                  >
                    {DAY_LABELS_SHORT[day.getDay()]}
                  </span>
                  {isToday ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xsmall14 font-semibold text-white">
                      {format(day, 'd', { locale: ko })}
                    </span>
                  ) : (
                    <span className="text-xsmall16 font-semibold text-neutral-10">
                      {format(day, 'd', { locale: ko })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div className="relative" style={{ minHeight: `${bodyMinHeight}px` }}>
            {/* Column dividers */}
            <div
              className="absolute inset-0"
              style={{ display: 'grid', gridTemplateColumns: gridCols }}
            >
              {days.map((day, i) => {
                const isMonthStart =
                  i > 0 && getMonth(day) !== getMonth(days[i - 1]);
                return (
                  <div
                    key={i}
                    className={
                      isMonthStart
                        ? 'border-l-2 border-primary-20'
                        : i > 0
                          ? 'border-l border-neutral-90'
                          : ''
                    }
                  />
                );
              })}
            </div>

            {/* Bars */}
            <div
              className="relative gap-y-1 py-3"
              style={{ display: 'grid', gridTemplateColumns: gridCols }}
            >
              {barLayouts.length === 0 && (
                <div
                  className="flex items-center justify-center py-8 text-xsmall14 text-neutral-40"
                  style={{ gridColumn: '1 / -1' }}
                >
                  예정된 피드백이 없습니다.
                </div>
              )}
              {barLayouts.map(({ bar, startCol, endCol, colSpan }, idx) => (
                <div
                  key={`${bar.challengeId}-${bar.missionId}-${idx}`}
                  style={{ gridColumn: `${startCol} / ${endCol}` }}
                >
                  {colSpan <= 1 ? (
                    <CompactFeedbackCard bar={bar} onBarClick={onBarClick} />
                  ) : (
                    <ChallengePeriodBar
                      bar={bar}
                      colSpan={colSpan}
                      onBarClick={onBarClick}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <TodayButton isTodayVisible={isTodayVisible} onGoToToday={scrollToToday} />
    </div>
  );
};

export default WeeklyCalendar;
