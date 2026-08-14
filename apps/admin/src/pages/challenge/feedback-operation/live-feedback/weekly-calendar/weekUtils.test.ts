import { describe, expect, it } from 'vitest';

import {
  GRID_END_HOUR,
  GRID_START_HOUR,
  SLOTS_PER_DAY,
  SLOT_MINUTES,
  getSlotPosition,
} from './weekUtils';

/**
 * 멘티 화면(web `useTimeSlotState.ts`)이 만드는 슬롯 시각과 같은 규칙.
 * 두 화면의 범위가 어긋나면 어드민에서만 슬롯이 사라진다.
 */
const MENTEE_LAST_SLOT_START_HOUR = 22;
const MENTEE_LAST_SLOT_START_MINUTE = 30;

const WEEK_START = '2026-08-17'; // 월요일
const WEDNESDAY = '2026-08-19';

const positionOf = (time: string, endTime: string) =>
  getSlotPosition(
    `${WEDNESDAY}T${time}`,
    `${WEDNESDAY}T${endTime}`,
    WEEK_START,
  );

describe('주간 그리드 시간 범위', () => {
  it('멘티가 고를 수 있는 마지막 슬롯까지 덮는다', () => {
    // 멘티는 22:30 시작 슬롯까지 고를 수 있다. 그리드가 그보다 먼저 끝나면
    // 그 슬롯은 WeeklyGrid 의 범위 필터에 걸려 화면에서 사라진다.
    const lastMenteeSlotEndHour =
      MENTEE_LAST_SLOT_START_MINUTE === 30
        ? MENTEE_LAST_SLOT_START_HOUR + 1
        : MENTEE_LAST_SLOT_START_HOUR;

    expect(GRID_END_HOUR).toBeGreaterThanOrEqual(lastMenteeSlotEndHour);
  });

  it('하루 슬롯 개수가 시작·끝 시각과 맞는다', () => {
    expect(SLOTS_PER_DAY).toBe(
      ((GRID_END_HOUR - GRID_START_HOUR) * 60) / SLOT_MINUTES,
    );
  });
});

describe('getSlotPosition', () => {
  it('그리드 첫 칸은 slotIndex 0 이다', () => {
    expect(positionOf('09:00:00', '09:30:00').slotIndex).toBe(0);
  });

  it('요일 인덱스는 월요일 기준이다', () => {
    // 2026-08-17(월) 기준 2026-08-19(수) = 2
    expect(positionOf('09:00:00', '09:30:00').dayIndex).toBe(2);
  });

  it('30분 슬롯의 span 은 1 이다', () => {
    expect(positionOf('20:30:00', '21:00:00').slotSpan).toBe(1);
  });

  /**
   * 2026-08-14 운영 문의 회귀 테스트.
   *
   * 김세실 멘토가 8/19 20:30~22:30 에 30분 슬롯 4건을 열었는데
   * 어드민 주간 캘린더에 3건만 보였다. GRID_END_HOUR 가 22 여서
   * 22:00 시작 슬롯의 slotIndex(26)가 SLOTS_PER_DAY(26) 와 같아졌고,
   * WeeklyGrid 의 `slotIndex < SLOTS_PER_DAY` 필터에 걸려 버려졌다.
   */
  it('20:30~22:30 사이 30분 슬롯 4건이 모두 그리드 안에 들어간다', () => {
    const slots = [
      ['20:30:00', '21:00:00'],
      ['21:00:00', '21:30:00'],
      ['21:30:00', '22:00:00'],
      ['22:00:00', '22:30:00'],
    ] as const;

    const indexes = slots.map(
      ([start, end]) => positionOf(start, end).slotIndex,
    );

    expect(indexes).toEqual([23, 24, 25, 26]);
    // WeeklyGrid 가 쓰는 범위 조건과 같은 판정
    indexes.forEach((slotIndex) => {
      expect(slotIndex).toBeGreaterThanOrEqual(0);
      expect(slotIndex).toBeLessThan(SLOTS_PER_DAY);
    });
  });
});
