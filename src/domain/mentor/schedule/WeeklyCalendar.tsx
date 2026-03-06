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
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
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
  }, [bars, weekStart]);

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
          (clampedStart.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1; // 1-based for grid
      const endCol =
        Math.round(
          (clampedEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24),
        ) + 2; // exclusive end

      return { bar, startCol, endCol };
    });
  }, [visibleBars, weekStart]);

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              className="flex flex-col items-center border-r border-neutral-100 px-2 py-3 last:border-r-0"
            >
              <span className={`text-xs font-medium ${i === 6 ? 'text-red-500' : 'text-neutral-500'}`}>
                {DAY_LABELS[i]}
              </span>
              <span
                className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                  isToday
                    ? 'bg-blue-500 text-white'
                    : i === 6
                      ? 'text-red-500'
                      : 'text-neutral-900'
                }`}
              >
                {format(day, 'd', { locale: ko })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bars area */}
      <div
        className="relative grid grid-cols-7 gap-y-1 px-1 py-2"
        style={{ minHeight: '120px' }}
      >
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
  );
};

export default WeeklyCalendar;
