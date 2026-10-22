// 데스크탑 캘린더 한 주 행 — 막대·당일 칩·+N 배지 (3층 구조)
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { useCalendarRender } from './CalendarContext';
import {
  BAR_AREA_H,
  CELL_HEIGHT,
  colOf,
  Day,
  eventColor,
  eventEnd,
  eventStart,
  MAX_ROWS,
  NUM_H,
  VISIBLE_ITEMS,
} from './calendarUtils';

interface Props {
  week: Day[];
  wi: number;
}

export default function CalendarDesktopWeek({ week, wi }: Props) {
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

  const weekStart = week[0];
  const weekEnd = week[6];
  const weekBars = bars.filter(
    (e) =>
      (barLaneOf.get(e.id) ?? 0) < VISIBLE_ITEMS &&
      !eventEnd(e).isBefore(weekStart) &&
      !eventStart(e).isAfter(weekEnd),
  );

  const periodStartDay = periodStart ? dayjs(periodStart).startOf('day') : null;
  const periodEndDay = periodEnd ? dayjs(periodEnd).startOf('day') : null;
  const outOfPeriod = (d: Day) =>
    (periodStartDay != null && d.isBefore(periodStartDay)) ||
    (periodEndDay != null && d.isAfter(periodEndDay));

  return (
    <div className="relative">
      <div className="grid grid-cols-7 gap-1">
        {week.map((d) => {
          const disabled = outOfPeriod(d);
          return (
            <button
              key={d.toString()}
              type="button"
              onClick={() => onSelect(d)}
              disabled={disabled}
              style={{ height: CELL_HEIGHT }}
              className={clsx(
                'border-neutral-80 flex border-b py-3',
                disabled && 'cursor-not-allowed',
              )}
            >
              <div
                className={clsx(
                  'rounded-xs w-full transition-colors',
                  !disabled &&
                    !d.isSame(selected, 'day') &&
                    'hover:bg-neutral-90',
                )}
              />
            </button>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col gap-1.5"
        style={{ top: NUM_H + 4, height: BAR_AREA_H }}
      >
        {Array.from({ length: MAX_ROWS }, (_, row) => {
          const rowBars = weekBars.filter((e) => barLaneOf.get(e.id) === row);
          return (
            <div
              key={row}
              className="grid h-[18px] grid-flow-dense grid-cols-7"
            >
              {/* 기간 막대 (여러 칸 span) */}
              {rowBars.map((e) => {
                const segStart = eventStart(e).isBefore(weekStart)
                  ? weekStart
                  : eventStart(e);
                const segEnd = eventEnd(e).isAfter(weekEnd)
                  ? weekEnd
                  : eventEnd(e);
                const showLabel =
                  !eventStart(e).isBefore(weekStart) || wi === 0;
                return (
                  <div
                    key={`bar-${e.id}`}
                    style={{
                      gridColumn: `${colOf(segStart)} / ${colOf(segEnd) + 1}`,
                      backgroundColor: eventColor(e),
                    }}
                    className="text-xxsmall10 rounded-xxs row-start-1 mx-0.5 flex items-center truncate px-1 tracking-tighter"
                    title={e.title}
                  >
                    {showLabel && <span className="truncate">{e.title}</span>}
                  </div>
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
                    className="text-xxsmall10 text-neutral-10 rounded-xxs row-start-1 mx-0.5 flex items-center truncate px-1 tracking-tighter"
                    title={p.event.title}
                  >
                    <span className="truncate">{p.event.title}</span>
                  </div>
                );
              })}
              {row === VISIBLE_ITEMS &&
                week.map((d, di) => {
                  const n = badgeByDate.get(d.format('YYYY-MM-DD')) ?? 0;
                  if (n === 0) return null;
                  return (
                    <div
                      key={`badge-${d.toString()}`}
                      style={{ gridColumn: di + 1 }}
                      className="text-xxsmall10 rounded-xxs row-start-1 mx-0.5 flex items-center bg-[#EFEFEF] px-1 tracking-tighter"
                    >
                      + {n}개
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 grid grid-cols-7 gap-1">
        {week.map((d) => {
          const isToday = d.isSame(today, 'day');
          const isSelected = d.isSame(selected, 'day');
          const dim = d.format('YYYY-MM') !== mainMonthKey;
          const disabled = outOfPeriod(d);
          return (
            <div
              key={d.toString()}
              style={{ height: CELL_HEIGHT }}
              className="flex py-3"
            >
              <div
                className={clsx(
                  'rounded-xs flex w-full flex-col items-center border-[1.5px] pt-3',
                  isSelected && !disabled
                    ? 'border-primary'
                    : 'border-transparent',
                )}
              >
                <span
                  className={clsx(
                    'text-xsmall16 w-full px-2 text-center',
                    disabled
                      ? 'text-neutral-80'
                      : isToday
                        ? 'text-primary'
                        : dim
                          ? 'text-neutral-60'
                          : 'text-neutral-0',
                  )}
                >
                  {d.date()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
