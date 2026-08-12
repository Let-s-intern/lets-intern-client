import { describe, expect, it } from 'vitest';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type { LiveMentoringSlot } from '@/api/live-mentoring/liveMentoringSchema';

import {
  toBlockedSlots,
  toGridSlots,
  toReservedSlots,
  toSlotRange,
  toSlotSaveRequest,
} from '../slotMapping';

const slot = (
  startDate: string,
  status: LiveMentoringSlot['status'],
  slotId = 1,
): LiveMentoringSlot => ({
  slotId,
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

describe('toBlockedSlots — 챌린지 슬롯을 점유로 표시', () => {
  const challengeSlots: FeedbackSlot[] = [
    {
      feedbackSlotId: 77,
      startDate: '2026-09-03T11:00:00',
      endDate: '2026-09-03T11:30:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 78,
      startDate: '2026-09-03T11:30:00',
      endDate: '2026-09-03T12:00:00',
      status: 'RESERVED',
    },
  ];

  it('예약 여부와 상관없이 전부 점유로 넘긴다', () => {
    // 유니크 제약은 예약 여부를 보지 않는다 — 열려 있기만 해도 1대1 로는 못 연다.
    expect(toBlockedSlots(challengeSlots)).toHaveLength(2);
  });

  it('왜 못 고르는지 알 수 있게 사유 라벨을 붙인다', () => {
    expect(toBlockedSlots(challengeSlots)[0]).toEqual({
      date: '2026-09-03',
      time: '11:00',
      challengeTitle: '라이브 피드백',
    });
  });

  it('menteeName 을 넣지 않는다 — 넣으면 그리드가 신청 완료로 그린다', () => {
    expect(toBlockedSlots(challengeSlots)[1].menteeName).toBeUndefined();
  });
});

describe('toSlotSaveRequest — 전체 치환 payload', () => {
  const serverSlots = [
    slot('2026-09-01T10:00:00', 'OPEN', 1),
    slot('2026-09-01T10:30:00', 'RESERVED', 2),
  ];

  it('예약 슬롯을 건드리지 않고 다른 슬롯만 바꿔도 payload 에 예약이 남는다', () => {
    // 회귀 케이스: 빠지면 서버가 삭제 대상으로 보고 409 LOCKED 로 저장 전체를 되돌린다.
    const payload = toSlotSaveRequest({
      selected: [{ date: '2026-09-02', time: '15:00' }],
      serverSlots,
    });

    expect(payload).toEqual([
      { startDate: '2026-09-01T10:30:00', endDate: '2026-09-01T11:00:00' },
      { startDate: '2026-09-02T15:00:00', endDate: '2026-09-02T15:30:00' },
    ]);
  });

  it('선택을 모두 해제해도 예약 슬롯은 남는다', () => {
    const payload = toSlotSaveRequest({ selected: [], serverSlots });
    expect(payload).toEqual([
      { startDate: '2026-09-01T10:30:00', endDate: '2026-09-01T11:00:00' },
    ]);
  });

  it('OPEN 슬롯을 해제하면 payload 에서 빠진다(삭제된다)', () => {
    const payload = toSlotSaveRequest({ selected: [], serverSlots });
    expect(payload.some((s) => s.startDate === '2026-09-01T10:00:00')).toBe(
      false,
    );
  });

  it('그리드 → payload → 그리드 왕복이 무손실이다', () => {
    const selected = toGridSlots(serverSlots);
    const payload = toSlotSaveRequest({ selected, serverSlots });

    expect(payload).toEqual([
      { startDate: '2026-09-01T10:00:00', endDate: '2026-09-01T10:30:00' },
      { startDate: '2026-09-01T10:30:00', endDate: '2026-09-01T11:00:00' },
    ]);
  });

  it('같은 시작 시각을 두 번 담지 않는다', () => {
    // 중복 시작 시각은 그 자체로 409 CONFLICT 다.
    const payload = toSlotSaveRequest({
      selected: [{ date: '2026-09-01', time: '10:30' }],
      serverSlots,
    });

    expect(payload).toHaveLength(1);
    expect(payload[0].startDate).toBe('2026-09-01T10:30:00');
  });

  it('챌린지 슬롯은 payload 에 들어가지 않는다', () => {
    // 챌린지 슬롯은 blockedSlots 로만 넘어가고 선택될 수 없다. 서버 슬롯 목록에도
    // 없으므로 payload 어디에도 나타나지 않는다.
    const payload = toSlotSaveRequest({
      selected: [{ date: '2026-09-02', time: '15:00' }],
      serverSlots,
    });

    expect(payload.some((s) => s.startDate.startsWith('2026-09-03'))).toBe(
      false,
    );
  });
});
