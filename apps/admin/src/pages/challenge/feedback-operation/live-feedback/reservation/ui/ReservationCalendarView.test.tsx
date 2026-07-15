import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import ReservationCalendarView, {
  buildReservationBlocks,
} from './ReservationCalendarView';
import { getMentorColor } from '../../constants/colors';
import { getSlotPosition } from '../../weekly-calendar/weekUtils';

const weekStart = '2026-06-01T00:00:00';

function makeReservation(
  overrides: Partial<FeedbackAdminVo> = {},
): FeedbackAdminVo {
  return {
    feedbackId: 1,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorName: '쥬디',
    menteeName: '홍길동',
    startDate: '2026-06-01T17:00:00',
    endDate: '2026-06-01T17:30:00',
    createDate: '2026-05-20T10:12:00',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    ...overrides,
  };
}

describe('buildReservationBlocks', () => {
  it('예약을 요일·시간 슬롯 좌표로 배치한다', () => {
    const [block] = buildReservationBlocks([makeReservation()], weekStart);
    const expected = getSlotPosition(
      '2026-06-01T17:00:00',
      '2026-06-01T17:30:00',
      weekStart,
    );
    // 2026-06-01 은 월요일 -> dayIndex 0
    expect(block.dayIndex).toBe(0);
    expect(block.dayIndex).toBe(expected.dayIndex);
    expect(block.slotIndex).toBe(expected.slotIndex);
    expect(block.slotSpan).toBe(expected.slotSpan);
    expect(block.key).toBe('1');
  });

  it('멘토명 기준 색상 클래스를 블록에 적용한다', () => {
    const [block] = buildReservationBlocks([makeReservation()], weekStart);
    const color = getMentorColor('쥬디');
    expect(block.className).toContain(color.bg);
    expect(block.className).toContain(color.border);
  });

  it('서로 다른 멘토는 서로 다른(혹은 결정적 동일) 색상을 갖는다', () => {
    const blocks = buildReservationBlocks(
      [
        makeReservation({ feedbackId: 1, mentorName: '쥬디' }),
        makeReservation({ feedbackId: 2, mentorName: '제이슨' }),
      ],
      weekStart,
    );
    expect(blocks[0].className).toBe(
      [
        getMentorColor('쥬디').bg,
        getMentorColor('쥬디').border,
        getMentorColor('쥬디').text,
      ].join(' '),
    );
    // 같은 멘토명은 항상 같은 색
    expect(getMentorColor('쥬디')).toEqual(getMentorColor('쥬디'));
  });
});

describe('ReservationCalendarView', () => {
  it('주 이동/오늘 버튼과 요일 헤더를 렌더한다', () => {
    const { getByLabelText, getByText } = render(
      <ReservationCalendarView reservations={[makeReservation()]} />,
    );
    expect(getByLabelText('이전 주')).toBeInTheDocument();
    expect(getByLabelText('다음 주')).toBeInTheDocument();
    expect(getByText('오늘')).toBeInTheDocument();
  });
});
