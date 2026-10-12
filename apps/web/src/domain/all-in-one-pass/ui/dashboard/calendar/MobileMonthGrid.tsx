import { useRef } from 'react';
import MobileWeekRow from './MobileWeekRow';
import { WEEKDAYS } from './calendarUtils';
import type { MobileCalendarState } from './useMobileCalendar';

/** 좌우 스와이프로 월 단위 이동 (임계값 50px) */
const SWIPE_THRESHOLD = 50;

/** 모바일 월간 그리드 — MON~SUN 헤더 + 주 단위 행 (한 칸 최대 3 + +N) */
export default function MobileMonthGrid({ cal }: { cal: MobileCalendarState }) {
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
        <MobileWeekRow
          key={wi}
          variant="month"
          wi={wi}
          week={week}
          bars={cal.bars}
          barLaneOf={cal.barLaneOf}
          pointsByDate={cal.pointsByDate}
          badgeByDate={cal.badgeByDate}
          mainMonthKey={cal.monthAnchor.format('YYYY-MM')}
          today={cal.today}
          selected={cal.selected}
          onSelect={cal.setSelected}
        />
      ))}
    </div>
  );
}
