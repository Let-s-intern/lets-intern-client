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
  /** 블록 클릭 시 상세 열기. 리스트 뷰의 "상세"와 동일 동작. */
  onView?: (feedbackId: number) => void;
}

/** 예약(FeedbackAdminVo)을 주간 시간대 그리드 블록으로 변환한다. */
export function buildReservationBlocks(
  reservations: FeedbackAdminVo[],
  weekStart: string,
  onView?: (feedbackId: number) => void,
): GridBlock[] {
  return reservations.map((r) => {
    const { dayIndex, slotIndex, slotSpan } = getSlotPosition(
      r.startDate,
      r.endDate,
      weekStart,
    );
    const color = getMentorColor(r.mentorName);
    const roundLabel = r.missionTh != null ? `${r.missionTh}회차 · ` : '';
    const subLine = `${roundLabel}${r.mentorName} · ${r.menteeName}`;
    return {
      key: String(r.feedbackId),
      dayIndex,
      slotIndex,
      slotSpan,
      className: twMerge(color.bg, color.border, color.text),
      onClick: onView ? () => onView(r.feedbackId) : undefined,
      title: `${r.programTitle || '-'} · ${subLine}`,
      isSession: true,
      content: (
        <>
          <span className="truncate font-semibold">
            {r.programTitle || '-'}
          </span>
          <span className="truncate opacity-80">{subLine}</span>
        </>
      ),
    };
  });
}

/** 예약 관리 캘린더 뷰. 표시 주의 예약만 그리드에 배치한다. */
export default function ReservationCalendarView({
  reservations,
  onView,
}: ReservationCalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const blocks = useMemo(
    () => buildReservationBlocks(reservations, weekStart, onView),
    [reservations, weekStart, onView],
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
