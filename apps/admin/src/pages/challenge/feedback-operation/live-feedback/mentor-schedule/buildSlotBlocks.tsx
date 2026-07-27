import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
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
 * 슬롯 상태별 스타일. 예약과 오픈을 색으로 확실히 구분한다.
 * (이전 점선/흰배경은 흰 그리드에서 잘 안 보여 색 채움으로 교체)
 */
const SLOT_STATUS_CLASS: Record<FeedbackSlotVo['status'], string> = {
  // 예약: 채운 인디고 블록(강조)
  RESERVED: 'border-indigo-600 bg-indigo-500 text-white shadow-sm',
  // 오픈: 가용 시간 표시. 강조하지 않도록 아주 연한 회색.
  OPEN: 'border-neutral-80 bg-neutral-95 text-neutral-40',
};

/**
 * 선택된 멘토의 슬롯을 주간 그리드 블록으로 변환한다.
 * 상태(예약/오픈)를 색으로 구분한다.
 */
export function buildSlotBlocks(
  mentorSlots: MentorSlots[],
  weekStart: string,
): GridBlock[] {
  return mentorSlots.flatMap(({ mentorId, slots }) =>
    slots.map((slot) => {
      const { dayIndex, slotIndex, slotSpan } = getSlotPosition(
        slot.startDate,
        slot.endDate,
        weekStart,
      );
      return {
        key: `${mentorId}-${slot.feedbackSlotId}`,
        dayIndex,
        slotIndex,
        slotSpan,
        className: SLOT_STATUS_CLASS[slot.status],
        title: SLOT_STATUS_LABEL[slot.status],
        content: (
          <span className="truncate text-center font-semibold">
            {SLOT_STATUS_LABEL[slot.status]}
          </span>
        ),
      };
    }),
  );
}
