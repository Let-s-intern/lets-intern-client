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

import ChallengePeriodBar, { type PeriodBarData } from './ChallengePeriodBar';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

interface WeeklyCalendarProps {
  weekStartDate: Date;
  bars: PeriodBarData[];
  onBarClick: (challengeId: number, missionId: number) => void;
}

const WeeklyCalendar = ({
  weekStartDate,
  bars,
  onBarClick,
}: WeeklyCalendarProps) => {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekStartTime = weekStart.getTime();
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekStartTime],
  );
  const today = new Date();

  // Filter bars that overlap with the current week
  const visibleBars = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);
    return bars.filter((bar) => {
      const barStart = new Date(bar.startDate);
      const barEnd = new Date(bar.endDate);
      return barStart <= weekEnd && barEnd >= weekStart;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars, weekStartTime]);

  // Calculate grid column positions for each bar
  const barLayouts = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);

    return visibleBars.map((bar) => {
      const barStart = new Date(bar.startDate);
      const barEnd = new Date(bar.endDate);

      // Clamp to the visible week
      const clampedStart = max([barStart, weekStart]);
      const clampedEnd = min([barEnd, weekEnd]);

      // dayIndex 0-based from Monday
      const startCol =
        Math.round(
          (clampedStart.getTime() - weekStart.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1; // 1-based for grid
      const endCol =
        Math.round(
          (clampedEnd.getTime() - weekStart.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 2; // exclusive end

      return { bar, startCol, endCol };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleBars, weekStartTime]);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200">
      {/* Day headers + grid body */}
      <div className="relative flex flex-col">
        {/* Day header row */}
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const isSunday = i === 6;

            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-5 py-6"
              >
                <span
                  className={`text-base font-semibold leading-6 ${
                    isSunday
                      ? 'text-red-600'
                      : isToday
                        ? 'text-neutral-500'
                        : 'text-neutral-800'
                  }`}
                >
                  {DAY_LABELS[i]}
                </span>
                {isToday ? (
                  <span className="flex items-center justify-center rounded-[400px] bg-primary p-2 text-2xl font-semibold leading-8 text-white">
                    {format(day, 'd', { locale: ko })}
                  </span>
                ) : (
                  <span
                    className={`text-2xl font-semibold leading-8 ${
                      isSunday ? 'text-red-600' : 'text-neutral-800'
                    }`}
                  >
                    {format(day, 'd', { locale: ko })}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid body with column dividers and bars */}
        <div className="relative" style={{ minHeight: '120px' }}>
          {/* Column dividers */}
          <div className="absolute inset-0 grid grid-cols-7">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={i < 6 ? 'border-r border-neutral-200' : ''}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="relative grid grid-cols-7 gap-y-1 py-7">
            {barLayouts.length === 0 && (
              <div className="col-span-7 flex items-center justify-center py-8 text-sm text-neutral-400">
                이번 주 예정된 피드백이 없습니다.
              </div>
            )}
            {barLayouts.map(({ bar, startCol, endCol }, idx) => (
              <div
                key={`${bar.challengeId}-${bar.missionId}-${idx}`}
                style={{
                  gridColumn: `${startCol} / ${endCol}`,
                }}
              >
                <ChallengePeriodBar bar={bar} onBarClick={onBarClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
