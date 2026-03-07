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

      const colSpan = endCol - startCol;

      return { bar, startCol, endCol, colSpan };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleBars, weekStartTime]);

  return (
    <div className="overflow-hidden rounded-[16px] border border-neutral-80">
      <div className="relative flex flex-col">
        {/* Day header row */}
        <div className="grid grid-cols-7 border-b border-neutral-80">
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const isSunday = i === 6;

            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center ${
                  isToday ? 'gap-3 pb-4 pt-6' : 'gap-5 py-6'
                } ${isToday ? 'rounded-[12px]' : ''}`}
              >
                <span
                  className={`text-xsmall16 font-semibold ${
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
                  <span className="flex aspect-square items-center justify-center rounded-full bg-primary p-2 text-medium24 font-semibold text-white">
                    {format(day, 'd', { locale: ko })}
                  </span>
                ) : (
                  <span
                    className={`text-medium24 font-semibold ${
                      isSunday ? 'text-neutral-10' : 'text-neutral-10'
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
                className={i < 6 ? 'border-r border-neutral-80' : ''}
              />
            ))}
          </div>

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
                style={{
                  gridColumn: `${startCol} / ${endCol}`,
                }}
              >
                <ChallengePeriodBar
                  bar={bar}
                  colSpan={colSpan}
                  onBarClick={onBarClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
