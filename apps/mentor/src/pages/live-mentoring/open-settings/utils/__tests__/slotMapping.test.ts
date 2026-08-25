import { describe, expect, it } from 'vitest';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';

import { toGridSlots, toReservedSlots, toSlotRange } from '../slotMapping';

const slot = (
  startDate: string,
  status: FeedbackSlot['status'],
  feedbackSlotId = 1,
): FeedbackSlot => ({
  feedbackSlotId,
  startDate,
  endDate: startDate.replace(/T(\d\d):(00|30):00$/, (_m, hh, mm) =>
    mm === '00'
      ? `T${hh}:30:00`
      : `T${String(Number(hh) + 1).padStart(2, '0')}:00:00`,
  ),
  status,
});

describe('toSlotRange — 그리드 셀 → 서버 시각', () => {
  it('종료 시각을 시작 +30분으로 만든다', () => {
    expect(toSlotRange({ date: '2026-09-01', time: '10:00' })).toEqual({
      startDate: '2026-09-01T10:00:00',
      endDate: '2026-09-01T10:30:00',
    });
  });

  it('30분 셀은 다음 시각으로 넘어간다', () => {
    expect(toSlotRange({ date: '2026-09-01', time: '10:30' })).toEqual({
      startDate: '2026-09-01T10:30:00',
      endDate: '2026-09-01T11:00:00',
    });
  });

  it('타임존 표기 없이 LocalDateTime 형태로 만든다', () => {
    // 서버는 `LocalDateTime` 이라 `Z`·오프셋이 붙으면 파싱하지 못한다.
    const { startDate } = toSlotRange({ date: '2026-09-01', time: '09:00' });
    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });
});

describe('toGridSlots / toReservedSlots — 상태별로 갈라 그린다', () => {
  const slots = [
    slot('2026-09-01T10:00:00', 'OPEN', 1),
    slot('2026-09-01T10:30:00', 'RESERVED', 2),
    slot('2026-09-02T14:00:00', 'OPEN', 3),
  ];

  it('선택 상태로 올리는 건 OPEN 뿐이다', () => {
    expect(toGridSlots(slots)).toEqual([
      { date: '2026-09-01', time: '10:00' },
      { date: '2026-09-02', time: '14:00' },
    ]);
  });

  it('RESERVED 는 잠금 셀로만 넘어간다', () => {
    expect(toReservedSlots(slots)).toEqual([
      { date: '2026-09-01', time: '10:30' },
    ]);
  });
});
