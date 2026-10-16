// 모바일 주간 뷰 — 좌우 스와이프 리본 (한 주씩 스냅)
import { useEffect, useRef } from 'react';
import CalendarMobileRow from './CalendarMobileRow';
import type { MobileCalendarState } from './useMobileCalendar';

export default function CalendarMobileWeek({
  cal,
}: {
  cal: MobileCalendarState;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

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
          <CalendarMobileRow variant="week" week={week} />
        </div>
      ))}
    </div>
  );
}
