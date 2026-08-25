import { useMemo, useState } from 'react';
import { APPLICATION_STATUS_LABELS } from '@/domain/live-mentoring/constants';
import { twMerge } from '@/lib/twMerge';
import { getMentorColor, LIVE_MENTORING_COLOR } from '../../constants/colors';
import WeeklyGrid, { type GridBlock } from '../../weekly-calendar/WeeklyGrid';
import WeekNavigator from '../../weekly-calendar/WeekNavigator';
import {
  getMonday,
  getSlotPosition,
  shiftWeek,
} from '../../weekly-calendar/weekUtils';
import {
  RESERVATION_KIND_LABEL,
  rowEndDate,
  rowKey,
  rowMenteeName,
  rowMentorName,
  rowProgramTitle,
  rowStartDate,
  type ReservationRow,
} from '../utils/reservationRow';

interface ReservationCalendarViewProps {
  reservations: ReservationRow[];
  /** 블록 클릭 시 상세 열기. 리스트 뷰의 "상세"와 동일 동작. */
  onView?: (row: ReservationRow) => void;
}

/** 블록에 적을 두 번째 줄. 챌린지는 회차를, 1대1은 플랜과 결제 상태를 덧붙인다. */
function subLine(row: ReservationRow): string {
  const who = `${rowMentorName(row)} · ${rowMenteeName(row)}`;
  if (row.kind === 'CHALLENGE') {
    const { missionTh } = row.feedback;
    return missionTh != null ? `${missionTh}회차 · ${who}` : who;
  }
  const { durationMinutes, status } = row.reservation;
  const plan = durationMinutes != null ? `${durationMinutes}분 · ` : '';
  return `${plan}${who} · ${APPLICATION_STATUS_LABELS[status]}`;
}

/**
 * 예약을 주간 시간대 그리드 블록으로 변환한다.
 *
 * 예약 일시가 없는 1대1 신청(결제 대기·선점 만료)은 놓을 좌표가 없어 캘린더에서 빠진다.
 * 리스트 뷰에는 그대로 남으므로 목록에서 보이지 않게 되는 건은 없다.
 */
export function buildReservationBlocks(
  reservations: ReservationRow[],
  weekStart: string,
  onView?: (row: ReservationRow) => void,
): GridBlock[] {
  return reservations.flatMap((row) => {
    const startDate = rowStartDate(row);
    const endDate = rowEndDate(row);
    if (!startDate || !endDate) return [];

    const { dayIndex, slotIndex, slotSpan } = getSlotPosition(
      startDate,
      endDate,
      weekStart,
    );
    const color =
      row.kind === 'CHALLENGE'
        ? getMentorColor(rowMentorName(row))
        : LIVE_MENTORING_COLOR;
    const title = rowProgramTitle(row);
    const typeLabel = RESERVATION_KIND_LABEL[row.kind];

    return [
      {
        key: rowKey(row),
        dayIndex,
        slotIndex,
        slotSpan,
        className: twMerge(color.bg, color.border, color.text),
        onClick: onView ? () => onView(row) : undefined,
        title: `[${typeLabel}] ${title} · ${subLine(row)}`,
        isSession: true,
        content: (
          <>
            <span className="truncate font-semibold">
              {row.kind === 'LIVE_MENTORING' ? `1대1 · ${title}` : title}
            </span>
            <span className="truncate opacity-80">{subLine(row)}</span>
          </>
        ),
      },
    ];
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
