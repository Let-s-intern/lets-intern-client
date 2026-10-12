// 모바일 월간 뷰 — 한 달 그리드 (좌우 스와이프로 월 이동)
import { useRef } from 'react';
import CalendarMobileRow from './CalendarMobileRow';
import { WEEKDAYS } from './calendarUtils';
import type { MobileCalendarState } from './useMobileCalendar';

const SWIPE_THRESHOLD = 50;
export default function CalendarMobileMonth({
  cal,
}: {
  cal: MobileCalendarState;
}) {
  const startX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx <= -SWIPE_THRESHOLD) cal.goNextMonth();
    else if (dx >= SWIPE_THRESHOLD) cal.goPrevMonth();
  };

  return (
    <div
      className="bg-neutral-95 rounded-md py-3"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid grid-cols-7 pb-1">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="text-xxsmall10 text-neutral-40 text-center font-medium"
          >
            {d}
          </span>
        ))}
      </div>
      {cal.monthWeeks.map((week, wi) => (
        <CalendarMobileRow key={wi} variant="month" week={week} />
      ))}
    </div>
  );
}
