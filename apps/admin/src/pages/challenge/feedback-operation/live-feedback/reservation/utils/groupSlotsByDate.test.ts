import { describe, expect, it } from 'vitest';
import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';

import {
  formatSlotTimeRange,
  groupSlotsByDate,
  slotDateKey,
} from './groupSlotsByDate';

const slot = (
  feedbackSlotId: number,
  startDate: string,
  endDate: string,
): FeedbackSlotVo => ({
  feedbackSlotId,
  startDate,
  endDate,
  status: 'OPEN',
});

describe('groupSlotsByDate', () => {
  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(groupSlotsByDate([])).toEqual([]);
  });

  it('같은 날짜의 슬롯을 하나의 그룹으로 묶고 날짜·시각 오름차순으로 정렬한다', () => {
    const result = groupSlotsByDate([
      slot(2, '2026-06-04T15:00:00', '2026-06-04T15:30:00'),
      slot(1, '2026-06-04T11:00:00', '2026-06-04T11:30:00'),
      slot(3, '2026-06-03T17:30:00', '2026-06-03T18:00:00'),
    ]);

    expect(result.map((g) => g.dateKey)).toEqual(['2026-06-03', '2026-06-04']);

    const june4 = result.find((g) => g.dateKey === '2026-06-04');
    expect(june4?.slots.map((s) => s.feedbackSlotId)).toEqual([1, 2]);
  });

  it('날짜 라벨을 YYYY.MM.DD (요일) 형식으로 만든다', () => {
    const [group] = groupSlotsByDate([
      slot(1, '2026-06-04T11:00:00', '2026-06-04T11:30:00'),
    ]);
    // 2026-06-04 는 목요일
    expect(group.dateLabel).toBe('2026.06.04 (목)');
  });
});

describe('slotDateKey', () => {
  it('시작시각의 날짜 키를 반환한다', () => {
    expect(slotDateKey('2026-06-04T11:00:00')).toBe('2026-06-04');
  });
});

describe('formatSlotTimeRange', () => {
  it('HH:mm ~ HH:mm 형식으로 표기한다', () => {
    expect(
      formatSlotTimeRange(
        slot(1, '2026-06-04T11:00:00', '2026-06-04T11:30:00'),
      ),
    ).toBe('11:00 ~ 11:30');
  });
});
