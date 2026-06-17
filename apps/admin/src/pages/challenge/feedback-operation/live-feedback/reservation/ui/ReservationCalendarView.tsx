import { useMemo, useState } from 'react';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';
import { getMentorColor } from '../../constants/colors';
import WeeklyGrid, { type GridBlock } from '../../weekly-calendar/WeeklyGrid';
import WeekNavigator from '../../weekly-calendar/WeekNavigator';
import {
  getMonday,
  getSlotPosition,
  shiftWeek,
} from '../../weekly-calendar/weekUtils';

interface ReservationCalendarViewProps {
  reservations: FeedbackAdminVo[];
}

/** 예약(FeedbackAdminVo)을 주간 시간대 그리드 블록으로 변환한다. */
export function buildReservationBlocks(
  reservations: FeedbackAdminVo[],
  weekStart: string,
): GridBlock[] {
  return reservations.map((r) => {
    const { dayIndex, slotIndex, slotSpan } = getSlotPosition(
      r.startDate,
      r.endDate,
      weekStart,
    );
    const color = getMentorColor(r.mentorName);
    return {
      key: String(r.feedbackId),
      dayIndex,
      slotIndex,
      slotSpan,
      className: twMerge(color.bg, color.border, color.text),
      content: (
        <>
          <div className="truncate font-semibold">{r.menteeName}</div>
          <div className="truncate">{r.programTitle || '-'}</div>
        </>
      ),
    };
  });
}

/** 예약 관리 캘린더 뷰. 표시 주의 예약만 그리드에 배치한다. */
export default function ReservationCalendarView({
  reservations,
}: ReservationCalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const blocks = useMemo(
    () => buildReservationBlocks(reservations, weekStart),
    [reservations, weekStart],
  );

  return (
    <div className="flex flex-col gap-3">
      <WeekNavigator
        weekStart={weekStart}
        onPrev={() => setWeekStart((w) => shiftWeek(w, -1))}
        onNext={() => setWeekStart((w) => shiftWeek(w, 1))}
        onToday={() => setWeekStart(getMonday(new Date()))}
      />
      <WeeklyGrid weekStart={weekStart} blocks={blocks} />
    </div>
  );
}
