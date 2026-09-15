import clsx from 'clsx';
import type { Dayjs } from 'dayjs';
import { barClass } from './calendarBarStyles';
import type { BarItem } from './useCalendarPreview';

const colOf = (d: Dayjs) => ((d.day() + 6) % 7) + 1;

interface Props {
  week: Dayjs[];
  wi: number;
  viewMonth: Dayjs;
  today: Dayjs;
  items: BarItem[];
  laneOf: Map<string, number>;
  laneCount: number;
}

/** 캘린더 한 주: 날짜 셀 + 막대 오버레이 */
export default function WeekRow({
  week,
  wi,
  viewMonth,
  today,
  items,
  laneOf,
  laneCount,
}: Props) {
  const weekStart = week[0];
  const weekEnd = week[6];
  const weekStartMs = weekStart.startOf('day').valueOf();
  const weekEndMs = weekEnd.endOf('day').valueOf();
  const lanes = Array.from({ length: laneCount }, (_, lane) =>
    items.filter(
      (x) =>
        laneOf.get(x.id) === lane &&
        x.start.valueOf() <= weekEndMs &&
        x.end.valueOf() >= weekStartMs,
    ),
  );
  const rowMinHeight = Math.max(122, 48 + laneCount * 18 + 12);

  return (
    <div className="relative">
      {/* 날짜 셀 */}
      <div className="my-3 grid grid-cols-7 gap-1">
        {week.map((d) => {
          const isToday = d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
          const isOtherMonth = d.month() !== viewMonth.month();
          return (
            <div
              key={d.toString()}
              style={{ minHeight: rowMinHeight }}
              className="border-neutral-80 border-b py-3 text-center"
            >
              <span
                className={clsx(
                  'text-small18 inline-flex items-center justify-center font-medium',
                  isToday && 'text-primary',
                  !isToday && isOtherMonth && 'text-neutral-70',
                  !isToday && !isOtherMonth && 'text-neutral-10',
                )}
              >
                {d.date()}
              </span>
            </div>
          );
        })}
      </div>

      {/* 막대 오버레이: 날짜 셀 위에 얹는 absolute 레이어.
          여러 날을 가로지르기 위해 별도 grid 로 두고, 셀 높이는 위 rowMinHeight
          로 레인 수만큼 확보해 이 막대들이 아래 주를 가리지 않게 한다. */}
      <div className="pointer-events-none absolute inset-x-0 top-12 flex flex-col gap-0.5">
        {lanes.map((laneItems, lane) => (
          <div key={lane} className="grid h-4 grid-cols-7">
            {laneItems.map((it) => {
              const segStart =
                it.start.valueOf() < weekStart.valueOf() ? weekStart : it.start;
              const segEnd =
                it.end.valueOf() > weekEnd.valueOf() ? weekEnd : it.end;
              const showLabel = it.start.valueOf() >= weekStartMs || wi === 0;
              return (
                <div
                  key={it.id}
                  style={{
                    gridColumn: `${colOf(segStart)} / ${colOf(segEnd) + 1}`,
                  }}
                  className={clsx(
                    'text-xxsmall12 mx-0.5 flex h-4 items-center gap-1 truncate rounded px-2',
                    barClass(it.kind, it.challengeType),
                  )}
                >
                  {showLabel && <span className="truncate">{it.title}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
