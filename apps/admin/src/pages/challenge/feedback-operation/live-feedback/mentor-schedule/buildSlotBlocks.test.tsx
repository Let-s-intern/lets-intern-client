import { describe, expect, it } from 'vitest';
import type {
  FeedbackAdminVo,
  FeedbackSlotVo,
} from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { buildSlotBlocks, type MentorSlots } from './buildSlotBlocks';
import { getMentorColor, LIVE_MENTORING_COLOR } from '../constants/colors';
import { buildReservationBlocks } from '../reservation/ui/ReservationCalendarView';
import {
  toChallengeRow,
  toLiveMentoringRow,
} from '../reservation/utils/reservationRow';
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

const challengeFeedback: FeedbackAdminVo = {
  feedbackId: 7,
  programTitle: '면접준비 챌린지',
  mentorId: 101,
  mentorName: '쥬디',
  menteeName: '홍길동',
  startDate: '2026-06-01T17:00:00',
  endDate: '2026-06-01T17:30:00',
  createDate: '2026-05-20T09:05:00',
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  status: 'RESERVED',
};

const liveMentoringReservation: AdminLiveMentoringReservation = {
  applicationId: 501,
  liveMentoringId: 10,
  productName: '이력서 1대1 첨삭',
  mentorId: 101,
  mentorName: '김멘토',
  mentorNickname: '쥬디',
  mentorEmail: null,
  menteeId: 77,
  menteeName: '최멘티',
  menteeEmail: null,
  menteePhoneNum: null,
  contactEmail: null,
  durationMinutes: 30,
  // 챌린지 예약과 같은 시간대. 색과 라벨로 갈리는지 보기 위한 배치다.
  reservationStartAt: '2026-06-01T17:00:00',
  reservationEndAt: '2026-06-01T17:30:00',
  status: 'CONFIRMED',
  createDate: '2026-05-21T09:00:00',
  questionDeferred: false,
  questionContent: null,
};

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

  it('예약 슬롯과 오픈 슬롯을 다른 색으로 구분한다', () => {
    const blocks = buildSlotBlocks(mentorSlots, weekStart);
    const reserved = blocks.find((b) => b.key === '101-1001');
    const open = blocks.find((b) => b.key === '101-1003');

    expect(reserved?.className).toContain('bg-indigo-500');
    expect(reserved?.title).toBe('예약');

    expect(open?.className).toContain('bg-neutral-95');
    expect(open?.title).toBe('오픈');
  });

  it('슬롯이 없는 멘토는 블록을 만들지 않는다', () => {
    const blocks = buildSlotBlocks(
      [{ mentorId: 999, mentorName: '신규멘토', slots: [] }],
      weekStart,
    );
    expect(blocks).toHaveLength(0);
  });
});

/**
 * 멘토 스케줄 그리드는 오픈 슬롯(buildSlotBlocks)과 예약(buildReservationBlocks)을
 * 합쳐 그린다. 여기서는 두 유형의 예약이 같은 시간대에 겹칠 때를 본다.
 */
describe('멘토 스케줄 그리드 — 두 유형이 섞인 경우', () => {
  const openOnly: MentorSlots[] = [
    { mentorId: 101, mentorName: '쥬디', slots: [judySlots[1]] },
  ];

  const blocks = [
    ...buildSlotBlocks(openOnly, weekStart),
    ...buildReservationBlocks(
      [
        toChallengeRow(challengeFeedback),
        toLiveMentoringRow(liveMentoringReservation),
      ],
      weekStart,
    ),
  ];

  it('오픈 슬롯과 두 유형의 예약이 모두 블록이 된다', () => {
    expect(blocks.map((b) => b.key)).toEqual([
      '101-1003',
      'challenge-7',
      'live-mentoring-501',
    ]);
  });

  it('같은 시간대라도 유형별로 색이 갈린다', () => {
    const challenge = blocks.find((b) => b.key === 'challenge-7');
    const liveMentoring = blocks.find((b) => b.key === 'live-mentoring-501');
    const open = blocks.find((b) => b.key === '101-1003');

    expect(challenge?.className).toContain(getMentorColor('쥬디').bg);
    expect(liveMentoring?.className).toContain(LIVE_MENTORING_COLOR.bg);
    expect(challenge?.className).not.toBe(liveMentoring?.className);
    expect(open?.className).not.toBe(liveMentoring?.className);
  });

  it('같은 좌표에 놓여도 라벨로 어느 유형인지 읽힌다', () => {
    const challenge = blocks.find((b) => b.key === 'challenge-7');
    const liveMentoring = blocks.find((b) => b.key === 'live-mentoring-501');

    expect(challenge?.dayIndex).toBe(liveMentoring?.dayIndex);
    expect(challenge?.slotIndex).toBe(liveMentoring?.slotIndex);
    expect(challenge?.title).toContain('챌린지 라이브 피드백');
    expect(liveMentoring?.title).toContain('1대1 라이브 멘토링');
  });
});
