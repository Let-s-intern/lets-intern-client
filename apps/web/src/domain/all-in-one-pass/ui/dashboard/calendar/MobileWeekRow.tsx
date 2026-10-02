import clsx from 'clsx';
import type { PassCalendarEvent } from '../../../types';
import { eventColor } from './calendarColors';
import type { PointPlacement } from './calendarModel';
import {
  colOf,
  Day,
  eventEnd,
  eventStart,
  MONTH_MAX_ROWS,
  MONTH_VISIBLE_ITEMS,
} from './calendarUtils';

const CELL_H = 72; // 셀 전체 높이
const PAD_TOP = 8; // 셀 상단 여백 (pt-2)
const NUM_H = 20; // 날짜 숫자 줄 높이 (leading-5)
/** 막대 시작 지점 = 상단여백 + 숫자 + 숫자↔막대 6px */
const LINE_TOP = PAD_TOP + NUM_H + 6;

interface Props {
  week: Day[];
  variant: 'week' | 'month';
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
 * 모바일 한 주 행 — 숫자 셀(선택=연보라 배경)
 * + 막대·당일 일정을 얇은 라인으로, 오버플로는 +N 텍스트(월간).
 */
export default function MobileWeekRow({
  week,
  variant,
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
  const itemRows = MONTH_MAX_ROWS; // 최대 4행 (렌더 대상 lane 0~3)
  const weekStart = week[0];
  const weekEnd = week[6];
  const weekBars = bars.filter(
    (e) =>
      (barLaneOf.get(e.id) ?? 0) < itemRows &&
      !eventEnd(e).isBefore(weekStart) &&
      !eventStart(e).isAfter(weekEnd),
  );

  return (
    <div className="relative w-full shrink-0">
      {/* 숫자 셀 */}
      <div className="grid grid-cols-7 pt-1">
        {week.map((d) => {
          const isToday = d.isSame(today, 'day');
          const isSelected = d.isSame(selected, 'day');
          const dim =
            variant === 'month' && d.format('YYYY-MM') !== mainMonthKey;
          return (
            <button
              key={d.toString()}
              type="button"
              onClick={() => onSelect(d)}
              style={{ height: CELL_H }}
              className="relative flex flex-col items-center pt-2"
            >
              {isSelected && (
                <span className="bg-primary-10 rounded-xs absolute inset-x-0 inset-y-0" />
              )}
              <span
                className={clsx(
                  'text-xsmall14 relative z-10 h-5 font-medium leading-5',
                  isToday
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

      {/* 막대·당일 라인 + 배지 — 라인 4px, 행 간격 2px, 최대 4행(5개↑는 3 + +N) */}
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

            {/* 당일 일정 (한 칸) */}
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

            {/* +N 배지 — 마지막(4번째) 행에서 오버플로 날짜의 막대 자리를 대체 */}
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
