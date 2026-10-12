// 모바일 캘린더 공용 한 주 행 — 얇은 막대 라인·+N (주간·월간 공유)
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { useCalendarRender } from './CalendarContext';
import {
  colOf,
  Day,
  eventColor,
  eventEnd,
  eventStart,
  MONTH_MAX_ROWS,
  MONTH_VISIBLE_ITEMS,
} from './calendarUtils';

const CELL_H = 72;
const PAD_TOP = 8;
const NUM_H = 20;
const LINE_TOP = PAD_TOP + NUM_H + 6;

interface Props {
  week: Day[];
  variant: 'week' | 'month';
}

export default function CalendarMobileRow({ week, variant }: Props) {
  const {
    bars,
    barLaneOf,
    pointsByDate,
    badgeByDate,
    mainMonthKey,
    today,
    selected,
    onSelect,
    periodStart,
    periodEnd,
  } = useCalendarRender();

  const itemRows = MONTH_MAX_ROWS;
  const weekStart = week[0];
  const weekEnd = week[6];

  const periodStartDay = periodStart ? dayjs(periodStart).startOf('day') : null;
  const periodEndDay = periodEnd ? dayjs(periodEnd).startOf('day') : null;
  const outOfPeriod = (d: Day) =>
    (periodStartDay != null && d.isBefore(periodStartDay)) ||
    (periodEndDay != null && d.isAfter(periodEndDay));

  const weekBars = bars.filter(
    (e) =>
      (barLaneOf.get(e.id) ?? 0) < itemRows &&
      !eventEnd(e).isBefore(weekStart) &&
      !eventStart(e).isAfter(weekEnd),
  );

  return (
    <div className="relative w-full shrink-0">
      <div className="grid grid-cols-7 pt-1">
        {week.map((d) => {
          const isToday = d.isSame(today, 'day');
          const isSelected = d.isSame(selected, 'day');
          const dim =
            variant === 'month' && d.format('YYYY-MM') !== mainMonthKey;
          const disabled = outOfPeriod(d);
          return (
            <button
              key={d.toString()}
              type="button"
              onClick={() => onSelect(d)}
              disabled={disabled}
              style={{ height: CELL_H }}
              className={clsx(
                'relative flex flex-col items-center pt-2',
                disabled && 'cursor-not-allowed',
              )}
            >
              {isSelected && !disabled && (
                <span className="bg-primary-10 rounded-xs absolute inset-x-0 inset-y-0" />
              )}
              <span
                className={clsx(
                  'text-xsmall14 relative z-10 h-5 font-medium leading-5',
                  disabled
                    ? 'text-neutral-80'
                    : isToday
                      ? 'text-primary font-bold'
                      : dim
                        ? 'text-neutral-60'
                        : 'text-neutral-0',
                )}
              >
                {d.date()}
              </span>
            </button>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col gap-[2px]"
        style={{ top: LINE_TOP }}
      >
        {Array.from({ length: itemRows }, (_, row) => (
          <div key={row} className="grid grid-cols-7 items-start">
            {/* 기간 막대 (여러 칸 span) */}
            {weekBars
              .filter((e) => barLaneOf.get(e.id) === row)
              .map((e) => {
                const segStart = eventStart(e).isBefore(weekStart)
                  ? weekStart
                  : eventStart(e);
                const segEnd = eventEnd(e).isAfter(weekEnd)
                  ? weekEnd
                  : eventEnd(e);
                return (
                  <div
                    key={`bar-${e.id}`}
                    style={{
                      gridColumn: `${colOf(segStart)} / ${colOf(segEnd) + 1}`,
                      backgroundColor: eventColor(e),
                    }}
                    className="h-[4px] rounded-full"
                  />
                );
              })}

            {week.map((d, di) => {
              const p = pointsByDate
                .get(d.format('YYYY-MM-DD'))
                ?.find((x) => x.lane === row);
              if (!p) return null;
              return (
                <div
                  key={`pt-${d.toString()}`}
                  style={{
                    gridColumn: di + 1,
                    backgroundColor: eventColor(p.event),
                  }}
                  className="h-[4px] rounded-full"
                />
              );
            })}

            {row === MONTH_VISIBLE_ITEMS &&
              week.map((d, di) => {
                const n = badgeByDate.get(d.format('YYYY-MM-DD')) ?? 0;
                if (n === 0) return null;
                return (
                  <span
                    key={`badge-${d.toString()}`}
                    style={{ gridColumn: di + 1 }}
                    className="text-xxsmall10 text-primary text-center font-medium leading-none"
                  >
                    +{n}
                  </span>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
