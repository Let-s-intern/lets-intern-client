'use client';

// U-1 데스크탑 캘린더 루트 — 2주 그리드 + 우측 선택일 목록
import { useMemo } from 'react';
import type { PassCalendarEvent } from '../../../types';
import { CalendarProvider, type CalendarRenderModel } from './CalendarContext';
import CalendarDayList from './CalendarDayList';
import CalendarDesktopHeader from './CalendarDesktopHeader';
import CalendarDesktopWeek from './CalendarDesktopWeek';
import { WEEKDAYS } from './calendarUtils';
import { useCalendar } from './useCalendar';

interface Props {
  events: PassCalendarEvent[];
  periodStart?: string;
  periodEnd?: string;
}

export default function CalendarDesktop({
  events,
  periodStart,
  periodEnd,
}: Props) {
  const cal = useCalendar(events, periodStart, periodEnd);

  const model: CalendarRenderModel = useMemo(
    () => ({
      bars: cal.bars,
      barLaneOf: cal.barLaneOf,
      pointsByDate: cal.pointsByDate,
      badgeByDate: cal.badgeByDate,
      today: cal.today,
      selected: cal.selected,
      onSelect: cal.setSelected,
      mainMonthKey: cal.mainMonthKey,
      periodStart,
      periodEnd,
    }),
    [
      cal.bars,
      cal.barLaneOf,
      cal.pointsByDate,
      cal.badgeByDate,
      cal.today,
      cal.selected,
      cal.setSelected,
      cal.mainMonthKey,
      periodStart,
      periodEnd,
    ],
  );

  return (
    <CalendarProvider value={model}>
      <section className="flex flex-col gap-6">
        <CalendarDesktopHeader
          windowStart={cal.windowStart}
          windowEnd={cal.windowEnd}
          filters={cal.filters}
          onPrev={cal.goPrevWeek}
          onNext={cal.goNextWeek}
          onToday={cal.goToday}
          onToggle={cal.toggleFilter}
          canPrev={cal.canPrevWeek}
          canNext={cal.canNextWeek}
        />

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="min-w-0 flex-1">
            <div className="border-neutral-80 grid grid-cols-7 border-b pb-3">
              {WEEKDAYS.map((d) => (
                <span
                  key={d}
                  className="text-xsmall14 text-neutral-40 text-center font-medium"
                >
                  {d}
                </span>
              ))}
            </div>

            {cal.weeks.map((week, wi) => (
              <CalendarDesktopWeek key={wi} week={week} wi={wi} />
            ))}
          </div>

          <CalendarDayList date={cal.selected} events={cal.selectedEvents} />
        </div>
      </section>
    </CalendarProvider>
  );
}
