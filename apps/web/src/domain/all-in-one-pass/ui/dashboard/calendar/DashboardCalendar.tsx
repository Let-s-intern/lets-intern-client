'use client';

import type { PassCalendarEvent } from '../../../types';
import CalendarHeader from './CalendarHeader';
import CalendarWeek from './CalendarWeek';
import DayProgramList from './DayProgramList';
import { WEEKDAYS } from './calendarUtils';
import { useCalendar } from './useCalendar';

interface Props {
  events: PassCalendarEvent[];
}

/** U-1 일정 캘린더 (데스크탑) — 2주 그리드 + 우측 프로그램 패널 */
export default function DashboardCalendar({ events }: Props) {
  const cal = useCalendar(events);

  return (
    <section className="flex flex-col gap-6">
      <CalendarHeader
        windowStart={cal.windowStart}
        windowEnd={cal.windowEnd}
        filters={cal.filters}
        onPrev={cal.goPrevWeek}
        onNext={cal.goNextWeek}
        onToggle={cal.toggleFilter}
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
            <CalendarWeek
              key={wi}
              week={week}
              wi={wi}
              bars={cal.bars}
              barLaneOf={cal.barLaneOf}
              pointsByDate={cal.pointsByDate}
              badgeByDate={cal.badgeByDate}
              mainMonthKey={cal.mainMonthKey}
              today={cal.today}
              selected={cal.selected}
              onSelect={cal.setSelected}
            />
          ))}
        </div>

        <DayProgramList date={cal.selected} events={cal.selectedEvents} />
      </div>
    </section>
  );
}
