import { describe, expect, it } from 'vitest';

import {
  diffGridAgainstBeSlots,
  toBeSlotCell,
  toCreateSlotRequest,
} from '../slotConverter';

describe('toBeSlotCell', () => {
  it('ISO startDate 를 date / time 으로 분해한다', () => {
    expect(
      toBeSlotCell({
        feedbackSlotId: 1,
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
        status: 'OPEN',
      }),
    ).toEqual({
      date: '2026-05-20',
      time: '10:00',
      feedbackSlotId: 1,
      status: 'OPEN',
    });
  });
});

describe('toCreateSlotRequest', () => {
  it('30분 길이의 startDate / endDate 페어를 만든다', () => {
    expect(toCreateSlotRequest({ date: '2026-05-20', time: '14:30' })).toEqual({
      startDate: '2026-05-20T14:30:00',
      endDate: '2026-05-20T15:00:00',
    });
  });

  it('정시(00분) 셀도 정확히 처리한다', () => {
    expect(toCreateSlotRequest({ date: '2026-05-20', time: '09:00' })).toEqual({
      startDate: '2026-05-20T09:00:00',
      endDate: '2026-05-20T09:30:00',
    });
  });
});

describe('diffGridAgainstBeSlots', () => {
  it('새로 선택된 셀은 creates 로 분류된다', () => {
    const result = diffGridAgainstBeSlots({
      selected: [{ date: '2026-05-20', time: '10:00' }],
      beSlots: [],
    });
    expect(result.creates).toEqual([
      { startDate: '2026-05-20T10:00:00', endDate: '2026-05-20T10:30:00' },
    ]);
    expect(result.deletes).toEqual([]);
  });

  it('해제된 OPEN 슬롯은 feedbackSlotId 로 deletes 에 들어간다', () => {
    const result = diffGridAgainstBeSlots({
      selected: [],
      beSlots: [
        {
          feedbackSlotId: 42,
          startDate: '2026-05-20T10:00:00',
          endDate: '2026-05-20T10:30:00',
          status: 'OPEN',
        },
      ],
    });
    expect(result.creates).toEqual([]);
    expect(result.deletes).toEqual([42]);
  });

  it('RESERVED 슬롯은 해제 의도가 있어도 deletes 에 포함되지 않는다', () => {
    const result = diffGridAgainstBeSlots({
      selected: [],
      beSlots: [
        {
          feedbackSlotId: 99,
          startDate: '2026-05-20T11:00:00',
          endDate: '2026-05-20T11:30:00',
          status: 'RESERVED',
        },
      ],
    });
    expect(result.deletes).toEqual([]);
  });

  it('유지 + 추가 + 삭제가 섞인 케이스를 올바르게 분류한다', () => {
    const result = diffGridAgainstBeSlots({
      selected: [
        // 기존 OPEN 유지
        { date: '2026-05-20', time: '10:00' },
        // 신규 추가
        { date: '2026-05-20', time: '14:00' },
      ],
      beSlots: [
        // 유지될 OPEN
        {
          feedbackSlotId: 1,
          startDate: '2026-05-20T10:00:00',
          endDate: '2026-05-20T10:30:00',
          status: 'OPEN',
        },
        // 해제될 OPEN (selected 에 없음)
        {
          feedbackSlotId: 2,
          startDate: '2026-05-20T13:00:00',
          endDate: '2026-05-20T13:30:00',
          status: 'OPEN',
        },
        // RESERVED — 항상 보존
        {
          feedbackSlotId: 3,
          startDate: '2026-05-20T15:00:00',
          endDate: '2026-05-20T15:30:00',
          status: 'RESERVED',
        },
      ],
    });

    expect(result.creates).toEqual([
      { startDate: '2026-05-20T14:00:00', endDate: '2026-05-20T14:30:00' },
    ]);
    expect(result.deletes).toEqual([2]);
  });
});
