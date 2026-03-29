'use client';

import {
  addDays,
  format,
  isSameDay,
  max,
  min,
  startOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo } from 'react';

import ChallengePeriodBar, {
  type PeriodBarData,
} from '../challenge-period/ChallengePeriodBar';
import { CompactFeedbackCard } from '../challenge-period/FeedbackCard';
import MonthDivider from './ui/MonthDivider';
import TodayButton from './ui/TodayButton';
import { useInfiniteWeekScroll } from './hooks/useInfiniteWeekScroll';
import { useCalendarLayout } from './hooks/useCalendarLayout';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// ---------------------------------------------------------------------------
// Utility: compute bar grid layouts for a given week
// ---------------------------------------------------------------------------

const computeBarLayouts = (bars: PeriodBarData[], weekStart: Date) => {
  const weekEnd = addDays(weekStart, 6);
  const visible = bars.filter((bar) => {
    const barStart = new Date(bar.startDate);
    const barEnd = new Date(bar.endDate);
    return barStart <= weekEnd && barEnd >= weekStart;
  });

  return visible.map((bar) => {
    const barStart = new Date(bar.startDate);
    const barEnd = new Date(bar.endDate);
    const clampedStart = max([barStart, weekStart]);
    const clampedEnd = min([barEnd, weekEnd]);

    const startCol =
      Math.round(
        (clampedStart.getTime() - weekStart.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    const endCol =
      Math.round(
        (clampedEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24),
      ) + 2;

    return { bar, startCol, endCol, colSpan: endCol - startCol };
  });
};

// ---------------------------------------------------------------------------
// WeeklyCalendar — single panel with slide animation
// ---------------------------------------------------------------------------

interface WeeklyCalendarProps {
  weekStartDate: Date;
  /** Filtered bars — only the selected challenge (or all if no filter) */
  bars: PeriodBarData[];
  /** All bars (unfiltered) — used for consistent height calculation */
  allBars: PeriodBarData[];
  onBarClick: (challengeId: number, missionId: number) => void;
  onWeekChange: (date: Date) => void;
}

const WeeklyCalendar = ({
  weekStartDate,
  bars,
  allBars,
  onBarClick,
  onWeekChange,
}: WeeklyCalendarProps) => {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekStartTime = weekStart.getTime();

  const { containerRef, goToCurrentWeek, slideStyle } =
    useInfiniteWeekScroll({ weekStartDate, onWeekChange });

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekStartTime],
  );
  const today = new Date();

  const isTodayVisible = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);
    return today >= weekStart && today <= weekEnd;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStartTime]);

  // Filtered bar layouts for rendering
  const barLayouts = useMemo(() => {
    return computeBarLayouts(bars, weekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars, weekStartTime]);

  // All bar count for consistent height (unfiltered)
  const allBarCount = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);
    return allBars.filter((bar) => {
      const s = new Date(bar.startDate);
      const e = new Date(bar.endDate);
      return s <= weekEnd && e >= weekStart;
    }).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBars, weekStartTime]);

  const { bodyMinHeight } = useCalendarLayout(allBarCount);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="touch-pan-y overflow-hidden rounded-2xl border border-neutral-80 select-none"
      >
        <div className="relative flex min-w-[640px] flex-col" style={slideStyle}>
          {/* Day header */}
          <div className="relative grid grid-cols-7 border-b border-neutral-80">
            {days.map((day, i) => {
              const isToday = isSameDay(day, today);
              const isSunday = i === 6;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center gap-1 py-2 ${isToday ? 'rounded-lg' : ''}`}
                >
                  <span
                    className={`text-xsmall14 font-medium ${
                      isSunday
                        ? 'text-[#dd1900]'
                        : isToday
                          ? 'text-neutral-40'
                          : 'text-neutral-10'
                    }`}
                  >
                    {DAY_LABELS[i]}
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
            <MonthDivider days={days} />
          </div>

          {/* Grid body */}
          <div className="relative" style={{ minHeight: `${bodyMinHeight}px` }}>
            {/* Column dividers */}
            <div className="absolute inset-0 grid grid-cols-7">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={i < 6 ? 'border-r border-neutral-80' : ''}
                />
              ))}
            </div>

            <MonthDivider days={days} />

            {/* Bars */}
            <div className="relative grid grid-cols-7 gap-y-1 py-7">
              {barLayouts.length === 0 && (
                <div className="col-span-7 flex items-center justify-center py-8 text-xsmall14 text-neutral-40">
                  이번 주 예정된 피드백이 없습니다.
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
      <TodayButton
        isTodayVisible={isTodayVisible}
        onGoToToday={goToCurrentWeek}
      />
    </div>
  );
};

export default WeeklyCalendar;
