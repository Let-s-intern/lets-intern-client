import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
import dayjs from '@/lib/dayjs';

/** 날짜키(YYYY-MM-DD) → 그 날짜의 슬롯 목록 (시작시각 오름차순) */
export interface SlotDateGroup {
  /** 그룹 키 — `YYYY-MM-DD` */
  dateKey: string;
  /** 드롭다운/선택 표기용 라벨 — 예: `2026.06.04 (목)` */
  dateLabel: string;
  slots: FeedbackSlotVo[];
}

/** 슬롯 시작시각의 날짜 키(YYYY-MM-DD) */
export function slotDateKey(startDate: string): string {
  return dayjs(startDate).format('YYYY-MM-DD');
}

/** 슬롯 시간대 표기 — 예: `11:00 ~ 11:30` */
export function formatSlotTimeRange(slot: FeedbackSlotVo): string {
  return `${dayjs(slot.startDate).format('HH:mm')} ~ ${dayjs(slot.endDate).format('HH:mm')}`;
}

/**
 * 슬롯 목록을 날짜별로 그룹핑한다.
 * - 날짜 그룹은 날짜 오름차순, 각 그룹 내 슬롯은 시작시각 오름차순.
 * - 빈 입력은 빈 배열을 반환한다.
 */
export function groupSlotsByDate(slots: FeedbackSlotVo[]): SlotDateGroup[] {
  const byKey = new Map<string, FeedbackSlotVo[]>();

  for (const slot of slots) {
    const key = slotDateKey(slot.startDate);
    const bucket = byKey.get(key);
    if (bucket) {
      bucket.push(slot);
    } else {
      byKey.set(key, [slot]);
    }
  }

  return [...byKey.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([dateKey, groupSlots]) => ({
      dateKey,
      dateLabel: dayjs(`${dateKey}T00:00:00`).format('YYYY.MM.DD (ddd)'),
      slots: groupSlots
        .slice()
        .sort((a, b) => (a.startDate < b.startDate ? -1 : 1)),
    }));
}
