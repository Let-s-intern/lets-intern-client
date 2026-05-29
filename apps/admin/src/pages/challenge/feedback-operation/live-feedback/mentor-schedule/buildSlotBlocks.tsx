import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';
import { getMentorColor } from '../constants/colors';
import type { GridBlock } from '../weekly-calendar/WeeklyGrid';
import { getSlotPosition } from '../weekly-calendar/weekUtils';

/** 멘토 1명의 슬롯 묶음. */
export interface MentorSlots {
  mentorId: number;
  mentorName: string;
  slots: FeedbackSlotVo[];
}

const SLOT_STATUS_LABEL: Record<FeedbackSlotVo['status'], string> = {
  OPEN: '오픈',
  RESERVED: '예약',
};

/**
 * 멘토별 슬롯을 주간 그리드 블록으로 합산·변환한다.
 *
 * - 색상 hue 는 멘토명 기준(getMentorColor).
 * - 상태 구분: RESERVED 는 채움(진한 배경), OPEN 은 점선 테두리 + 옅은 표시.
 */
export function buildSlotBlocks(
  mentorSlots: MentorSlots[],
  weekStart: string,
): GridBlock[] {
  return mentorSlots.flatMap(({ mentorId, mentorName, slots }) => {
    const color = getMentorColor(mentorName);
    return slots.map((slot) => {
      const { dayIndex, slotIndex, slotSpan } = getSlotPosition(
        slot.startDate,
        slot.endDate,
        weekStart,
      );
      const statusClass =
        slot.status === 'RESERVED'
          ? twMerge(color.bg, color.border, color.text)
          : twMerge('bg-white border-dashed', color.border, color.text);
      return {
        key: `${mentorId}-${slot.feedbackSlotId}`,
        dayIndex,
        slotIndex,
        slotSpan,
        className: statusClass,
        content: (
          <>
            <div className="truncate font-semibold">{mentorName}</div>
            <div className="truncate">{SLOT_STATUS_LABEL[slot.status]}</div>
          </>
        ),
      };
    });
  });
}
