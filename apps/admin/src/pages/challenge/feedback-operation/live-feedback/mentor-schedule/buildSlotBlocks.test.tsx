import { describe, expect, it } from 'vitest';
import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
import { buildSlotBlocks, type MentorSlots } from './buildSlotBlocks';
import { getMentorColor } from '../constants/colors';
import { getSlotPosition } from '../weekly-calendar/weekUtils';

const weekStart = '2026-06-01T00:00:00';

const judySlots: FeedbackSlotVo[] = [
  {
    feedbackSlotId: 1001,
    startDate: '2026-06-01T17:00:00',
    endDate: '2026-06-01T17:30:00',
    status: 'RESERVED',
  },
  {
    feedbackSlotId: 1003,
    startDate: '2026-06-02T17:00:00',
    endDate: '2026-06-02T17:30:00',
    status: 'OPEN',
  },
];

const jasonSlots: FeedbackSlotVo[] = [
  {
    feedbackSlotId: 2001,
    startDate: '2026-06-04T19:00:00',
    endDate: '2026-06-04T19:30:00',
    status: 'RESERVED',
  },
];

const mentorSlots: MentorSlots[] = [
  { mentorId: 101, mentorName: '쥬디', slots: judySlots },
  { mentorId: 102, mentorName: '제이슨', slots: jasonSlots },
];

describe('buildSlotBlocks', () => {
  it('여러 멘토의 슬롯을 모두 합산해 블록으로 만든다', () => {
    const blocks = buildSlotBlocks(mentorSlots, weekStart);
    expect(blocks).toHaveLength(3);
    expect(blocks.map((b) => b.key)).toEqual([
      '101-1001',
      '101-1003',
      '102-2001',
    ]);
  });

  it('슬롯을 요일·시간 좌표로 배치한다', () => {
    const [first] = buildSlotBlocks(mentorSlots, weekStart);
    const expected = getSlotPosition(
      '2026-06-01T17:00:00',
      '2026-06-01T17:30:00',
      weekStart,
    );
    expect(first.dayIndex).toBe(0);
    expect(first.slotIndex).toBe(expected.slotIndex);
    expect(first.slotSpan).toBe(expected.slotSpan);
  });

  it('RESERVED 는 멘토 색 채움, OPEN 은 점선 테두리로 상태를 구분한다', () => {
    const blocks = buildSlotBlocks(mentorSlots, weekStart);
    const reserved = blocks.find((b) => b.key === '101-1001');
    const open = blocks.find((b) => b.key === '101-1003');
    const judyColor = getMentorColor('쥬디');

    expect(reserved?.className).toContain(judyColor.bg);
    expect(reserved?.className).not.toContain('border-dashed');

    expect(open?.className).toContain('border-dashed');
    expect(open?.className).toContain('bg-white');
    // OPEN 도 멘토 색 테두리는 유지
    expect(open?.className).toContain(judyColor.border);
  });

  it('멘토별 색상은 멘토명 기준으로 다르게(결정적으로) 매핑된다', () => {
    const blocks = buildSlotBlocks(mentorSlots, weekStart);
    const judyBlock = blocks.find((b) => b.key === '101-1001');
    const jasonBlock = blocks.find((b) => b.key === '102-2001');
    expect(judyBlock?.className).toContain(getMentorColor('쥬디').bg);
    expect(jasonBlock?.className).toContain(getMentorColor('제이슨').bg);
  });

  it('슬롯이 없는 멘토는 블록을 만들지 않는다', () => {
    const blocks = buildSlotBlocks(
      [{ mentorId: 999, mentorName: '신규멘토', slots: [] }],
      weekStart,
    );
    expect(blocks).toHaveLength(0);
  });
});
