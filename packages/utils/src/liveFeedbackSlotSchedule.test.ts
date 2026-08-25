import { describe, expect, it } from 'vitest';

import {
  SLOT_END_HOUR,
  SLOT_MINUTES,
  SLOT_START_HOUR,
  SLOT_START_TIMES,
  SLOTS_PER_DAY,
  isAllowedSlotStartTime,
  toSlotIndex,
} from './liveFeedbackSlotSchedule';

/**
 * 정책: 슬롯 시작은 09:00 ~ 22:30, 마지막 슬롯은 23:00 에 끝난다.
 * 이 숫자가 바뀌면 멘토·멘티·어드민 세 화면이 같이 바뀌어야 하므로 여기서 못 박는다.
 */
describe('슬롯 시간 정책', () => {
  it('09:00 에 시작해 22:30 이 마지막이다', () => {
    expect(SLOT_START_TIMES[0]).toBe('09:00');
    expect(SLOT_START_TIMES.at(-1)).toBe('22:30');
  });

  it('하루 28칸이다', () => {
    expect(SLOT_START_TIMES).toHaveLength(28);
    expect(SLOTS_PER_DAY).toBe(28);
  });

  it('칸 수는 시작·끝 시각에서 계산된다', () => {
    expect(SLOTS_PER_DAY).toBe(
      ((SLOT_END_HOUR - SLOT_START_HOUR) * 60) / SLOT_MINUTES,
    );
  });

  it('30분 간격으로 빠짐없이 이어진다', () => {
    // 예전 멘토 화면은 22:30 만 건너뛰어 목록에 구멍이 있었다.
    SLOT_START_TIMES.forEach((time, index) => {
      const minutesFromStart = index * SLOT_MINUTES;
      const hour = SLOT_START_HOUR + Math.floor(minutesFromStart / 60);
      const minute = minutesFromStart % 60;
      expect(time).toBe(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      );
    });
  });
});

describe('isAllowedSlotStartTime', () => {
  it('22:30 은 허용한다', () => {
    expect(isAllowedSlotStartTime('22:30')).toBe(true);
  });

  it('23:00 과 08:30 은 허용하지 않는다', () => {
    expect(isAllowedSlotStartTime('23:00')).toBe(false);
    expect(isAllowedSlotStartTime('08:30')).toBe(false);
  });
});

describe('toSlotIndex', () => {
  it('첫 칸은 0 이다', () => {
    expect(toSlotIndex(9, 0)).toBe(0);
  });

  /**
   * 2026-08-14 운영 문의 회귀.
   * 어드민 그리드가 22:00 에서 끊겨 22:00~22:30 슬롯이 사라졌다.
   */
  it('20:30~22:30 네 칸이 모두 범위 안이다', () => {
    expect([
      toSlotIndex(20, 30),
      toSlotIndex(21, 0),
      toSlotIndex(21, 30),
      toSlotIndex(22, 0),
    ]).toEqual([23, 24, 25, 26]);
  });

  it('마지막 칸은 22:30 이다', () => {
    expect(toSlotIndex(22, 30)).toBe(SLOTS_PER_DAY - 1);
  });

  it('범위 밖은 null 을 돌려준다', () => {
    // 조용히 버려지지 않도록 호출부가 알아챌 수 있어야 한다.
    expect(toSlotIndex(23, 0)).toBeNull();
    expect(toSlotIndex(8, 30)).toBeNull();
  });
});
