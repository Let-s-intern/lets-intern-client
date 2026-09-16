import clsx from 'clsx';
import type { Dayjs } from 'dayjs';
import { barClass } from './calendarBarStyles';
import type { BarItem } from './useCalendarPreview';

const colOf = (d: Dayjs) => ((d.day() + 6) % 7) + 1;
const MAX_VISIBLE_LANES = 5;

interface Props {
  week: Dayjs[];
  wi: number;
  mainMonthKey: string;
  today: Dayjs;
  items: BarItem[];
  laneOf: Map<string, number>;
}

/** 캘린더 한 주: 날짜 셀 + 막대 오버레이 */
export default function WeekRow({
  week,
  wi,
  mainMonthKey,
  today,
  items,
  laneOf,
}: Props) {
  const weekStart = week[0];
  const weekEnd = week[6];
  const weekStartMs = weekStart.startOf('day').valueOf();
  const weekEndMs = weekEnd.endOf('day').valueOf();

  // 이 주에 걸치는 항목만 대상으로, 실제 사용된 레인 수(최대 표시 수로 제한)
  const weekItems = items.filter(
    (x) => x.start.valueOf() <= weekEndMs && x.end.valueOf() >= weekStartMs,
  );
  const weekMaxLane = weekItems.reduce(
    (m, x) => Math.max(m, laneOf.get(x.id) ?? 0),
    -1,
  );
  const visibleLaneCount = Math.min(weekMaxLane + 1, MAX_VISIBLE_LANES);
  const lanes = Array.from({ length: visibleLaneCount }, (_, lane) =>
    weekItems.filter((x) => laneOf.get(x.id) === lane),
  );

  // 셀별 초과 개수: 하루에 겹치는 항목 수 - 최대 표시 레인
  const dayOverflow = week.map((d) => {
    const ds = d.startOf('day').valueOf();
    const de = d.endOf('day').valueOf();
    const count = items.filter(
      (x) => x.start.valueOf() <= de && x.end.valueOf() >= ds,
    ).length;
    return Math.max(0, count - MAX_VISIBLE_LANES);
  });

  return (
    <div className="relative">
      {/* 날짜 셀 */}
      <div className="grid grid-cols-7 gap-1">
        {week.map((d) => {
          const isToday = d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
          const isOtherMonth = d.format('YYYY-MM') !== mainMonthKey;
          return (
            <div
              key={d.toString()}
              className="border-neutral-80 h-[236px] border-b py-6 text-center"
            >
              <span
                className={clsx(
                  'text-small18 font-medium',
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

      {/* 막대 오버레이 */}
      <div className="pointer-events-none absolute inset-x-0 top-[62px] flex flex-col gap-1">
        {lanes.map((laneItems, lane) => (
          <div key={lane} className="grid h-6 grid-cols-7">
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
                    'text-xxsmall12 mx-0.5 flex h-6 items-center truncate rounded px-2',
                    barClass(it.kind, it.challengeType),
                  )}
                >
                  {showLabel && <span className="truncate">{it.title}</span>}
                </div>
              );
            })}
          </div>
        ))}

        {dayOverflow.some((o) => o > 0) && (
          <div className="grid grid-cols-7">
            {dayOverflow.map((o, col) => (
              <div key={col} className="px-2">
                {o > 0 && (
                  <span className="text-xxsmall12 text-neutral-40">+{o}개</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
