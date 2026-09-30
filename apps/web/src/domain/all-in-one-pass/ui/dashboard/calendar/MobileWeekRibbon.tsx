import { useEffect, useRef } from 'react';
import MobileWeekRow from './MobileWeekRow';
import type { MobileCalendarState } from './useMobileCalendar';

/**
 * 모바일 주간 리본 — 패스 기간 내 주(월요일)를 좌우 스와이프(스냅).
 * 선택일이 속한 주로 자동 스크롤. 요일 헤더 없이 날짜만 노출.
 */
export default function MobileWeekRibbon({
  cal,
}: {
  cal: MobileCalendarState;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const selIdx = cal.weeks.findIndex(
    (w) => !cal.selected.isBefore(w[0]) && !cal.selected.isAfter(w[6]),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || selIdx < 0) return;
    el.scrollTo({ left: selIdx * el.clientWidth, behavior: 'smooth' });
  }, [selIdx]);

  return (
    <div
      ref={ref}
      className="bg-neutral-95 flex snap-x snap-mandatory overflow-x-auto rounded-sm py-1.5 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {cal.weeks.map((week, wi) => (
        <div key={wi} className="w-full shrink-0 snap-start px-1.5">
          <MobileWeekRow
            variant="week"
            wi={wi}
            week={week}
            bars={cal.bars}
            barLaneOf={cal.barLaneOf}
            pointsByDate={cal.pointsByDate}
            badgeByDate={cal.badgeByDate}
            mainMonthKey={cal.selected.format('YYYY-MM')}
            today={cal.today}
            selected={cal.selected}
            onSelect={cal.setSelected}
          />
        </div>
      ))}
    </div>
  );
}
