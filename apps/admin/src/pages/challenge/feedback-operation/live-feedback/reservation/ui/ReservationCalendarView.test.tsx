import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import ReservationCalendarView, {
  buildReservationBlocks,
} from './ReservationCalendarView';
import { getMentorColor, LIVE_MENTORING_COLOR } from '../../constants/colors';
import { getSlotPosition } from '../../weekly-calendar/weekUtils';
import {
  toChallengeRow,
  toLiveMentoringRow,
  type ReservationRow,
} from '../utils/reservationRow';

const weekStart = '2026-06-01T00:00:00';

function makeReservation(
  overrides: Partial<FeedbackAdminVo> = {},
): ReservationRow {
  return toChallengeRow({
    feedbackId: 1,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorId: 101,
    mentorName: '쥬디',
    menteeName: '홍길동',
    startDate: '2026-06-01T17:00:00',
    endDate: '2026-06-01T17:30:00',
    createDate: '2026-05-20T10:12:00',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    ...overrides,
  });
}

function makeLiveMentoring(
  overrides: Partial<AdminLiveMentoringReservation> = {},
): ReservationRow {
  return toLiveMentoringRow({
    applicationId: 501,
    liveMentoringId: 10,
    productName: '이력서 1대1 첨삭',
    mentorId: 21,
    mentorName: '김멘토',
    mentorNickname: '렛츠멘토',
    mentorEmail: null,
    menteeId: 77,
    menteeName: '최멘티',
    menteeEmail: null,
    menteePhoneNum: null,
    contactEmail: null,
    durationMinutes: 30,
    reservationStartAt: '2026-06-01T17:00:00',
    reservationEndAt: '2026-06-01T17:30:00',
    status: 'CONFIRMED',
    createDate: '2026-05-21T09:00:00',
    questionDeferred: false,
    questionContent: null,
    ...overrides,
  });
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
    expect(block.key).toBe('challenge-1');
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

  // 같은 시간대에 나란히 놓여도 색과 라벨로 갈려야 한다.
  it('1대1 예약은 멘토 팔레트가 아닌 전용 색으로 그린다', () => {
    const [challenge, liveMentoring] = buildReservationBlocks(
      [makeReservation(), makeLiveMentoring()],
      weekStart,
    );
    expect(liveMentoring.key).toBe('live-mentoring-501');
    expect(liveMentoring.className).toContain(LIVE_MENTORING_COLOR.bg);
    expect(liveMentoring.className).not.toBe(challenge.className);
    expect(liveMentoring.title).toContain('1대1 라이브 멘토링');
    expect(liveMentoring.title).toContain('결제 완료');
  });

  it('예약 일시가 없는 1대1 신청은 캘린더에 놓지 않는다', () => {
    const blocks = buildReservationBlocks(
      [
        makeLiveMentoring({
          status: 'PAYMENT_PENDING',
          reservationStartAt: null,
          reservationEndAt: null,
        }),
      ],
      weekStart,
    );
    expect(blocks).toHaveLength(0);
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
