import clsx from 'clsx';
import type { PassCalendarEvent } from '../../../types';
import { eventColor } from './calendarColors';
import {
  BAR_AREA_H,
  CELL_HEIGHT,
  colOf,
  Day,
  eventEnd,
  eventStart,
  MAX_ROWS,
  NUM_H,
  VISIBLE_ITEMS,
} from './calendarUtils';
import type { PointPlacement } from './useCalendar';

interface Props {
  week: Day[];
  /** 창 안에서 몇 번째 주인지 (연속 막대 라벨 처리용) */
  wi: number;
  bars: PassCalendarEvent[];
  barLaneOf: Map<number, number>;
  pointsByDate: Map<string, PointPlacement[]>;
  badgeByDate: Map<string, number>;
  mainMonthKey: string;
  today: Day;
  selected: Day;
  onSelect: (d: Day) => void;
}

/**
 * 캘린더 한 주 — 3층 구조:
 * ① 호버 배경 + 클릭(막대 뒤) · ② 막대·당일 칩·배지 · ③ 숫자 + 선택 테두리(위, 클릭 통과)
 */
export default function CalendarWeek({
  week,
  wi,
  bars,
  barLaneOf,
  pointsByDate,
  badgeByDate,
  mainMonthKey,
  today,
  selected,
  onSelect,
}: Props) {
  const weekStart = week[0];
  const weekEnd = week[6];
  const weekBars = bars.filter(
    (e) => !eventEnd(e).isBefore(weekStart) && !eventStart(e).isAfter(weekEnd),
  );

  return (
    <div className="relative">
      {/* ① 클릭 + 호버 배경 (막대 뒤) */}
      <div className="grid grid-cols-7 gap-1">
        {week.map((d) => (
          <button
            key={d.toString()}
            type="button"
            onClick={() => onSelect(d)}
            style={{ height: CELL_HEIGHT }}
            className="border-neutral-80 flex border-b py-3"
          >
            <div
              className={clsx(
                'rounded-xs w-full transition-colors',
                !d.isSame(selected, 'day') && 'hover:bg-neutral-90',
              )}
            />
          </button>
        ))}
      </div>

      {/* ② 막대 · 당일 칩 · 배지 (표시용) */}
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col gap-1.5"
        style={{ top: NUM_H + 4, height: BAR_AREA_H }}
      >
        {Array.from({ length: MAX_ROWS }, (_, row) => {
          const rowBars = weekBars.filter((e) => barLaneOf.get(e.id) === row);
          return (
            <div key={row} className="grid h-[18px] grid-cols-7">
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
                    className="text-xxsmall10 rounded-xxs mx-0.5 flex items-center truncate px-1 tracking-tighter"
                    title={e.title}
                  >
                    {showLabel && <span className="truncate">{e.title}</span>}
                  </div>
                );
              })}

              {/* 당일 칩 (한 칸) */}
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
                    className="text-xxsmall10 text-neutral-10 rounded-xxs mx-0.5 flex items-center truncate px-1 tracking-tighter"
                    title={p.event.title}
                  >
                    <span className="truncate">{p.event.title}</span>
                  </div>
                );
              })}

              {/* +N 배지 (오버플로 날짜, 마지막 행) */}
              {row === VISIBLE_ITEMS &&
                week.map((d, di) => {
                  const n = badgeByDate.get(d.format('YYYY-MM-DD')) ?? 0;
                  if (n === 0) return null;
                  return (
                    <div
                      key={`badge-${d.toString()}`}
                      style={{ gridColumn: di + 1 }}
                      className="text-xxsmall10 rounded-xxs mx-0.5 flex items-center bg-[#EFEFEF] px-1 tracking-tighter"
                    >
                      + {n}개
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* ③ 숫자 + 선택 테두리 (막대 위, 클릭은 아래로 통과) */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-7 gap-1">
        {week.map((d) => {
          const isToday = d.isSame(today, 'day');
          const isSelected = d.isSame(selected, 'day');
          const dim = d.format('YYYY-MM') !== mainMonthKey;
          return (
            <div
              key={d.toString()}
              style={{ height: CELL_HEIGHT }}
              className="flex py-3"
            >
              <div
                className={clsx(
                  'rounded-xs flex w-full flex-col items-center border-[1.5px] pt-3',
                  isSelected ? 'border-primary' : 'border-transparent',
                )}
              >
                <span
                  className={clsx(
                    'text-xsmall16 w-full px-2 text-center',
                    isToday
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
