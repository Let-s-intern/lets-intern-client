import { useEffect, useRef } from 'react';
import MobileWeekRow from './MobileWeekRow';
import type { MobileCalendarState } from './useMobileCalendar';

/**
 * 모바일 주간 리본 — 패스 기간 내 주(월요일)를 좌우 스와이프(스냅).
 * weekIndex 로 스크롤 위치를 동기화: 화살표/피커로 바뀌면 스크롤하고,
 * 손으로 넘기면(스와이프) 멈춘 뒤 weekIndex 를 갱신한다(헤더 월도 따라감).
 */
export default function MobileWeekRibbon({
  cal,
}: {
  cal: MobileCalendarState;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

  // weekIndex → 스크롤 위치 (이미 그 위치면 재스크롤 안 함)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = cal.weekIndex * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 2) {
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [cal.weekIndex]);

  // 스와이프가 멈추면(디바운스) 보이는 주로 weekIndex 갱신
  const onScroll = () => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = ref.current;
      if (!el || el.clientWidth === 0) return;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (idx !== cal.weekIndex) cal.setWeekIndex(idx);
    }, 120);
  };

  return (
    <div
      ref={ref}
      onScroll={onScroll}
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
