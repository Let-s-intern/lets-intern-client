import { describe, expect, it } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import {
  rowKey,
  toChallengeRow,
  toLiveMentoringRow,
  type ReservationRow,
} from './reservationRow';
import { filterByMenteeName, sortReservations } from './sortReservations';

const make = (overrides: Partial<FeedbackAdminVo>): ReservationRow =>
  toChallengeRow({
    feedbackId: 1,
    programTitle: '면접준비 챌린지',
    mentorId: 101,
    mentorName: '쥬디',
    menteeName: '가나다',
    startDate: '2026-05-29T17:00:00',
    endDate: '2026-05-29T17:30:00',
    createDate: '2026-05-20T09:00:00',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    ...overrides,
  });

const makeLiveMentoring = (
  overrides: Partial<AdminLiveMentoringReservation>,
): ReservationRow =>
  toLiveMentoringRow({
    applicationId: 501,
    liveMentoringId: 10,
    productName: '이력서 1대1 첨삭',
    mentorId: 21,
    mentorName: '김멘토',
    mentorNickname: '렛츠멘토',
    mentorEmail: 'mentor@letscareer.co.kr',
    menteeId: 77,
    menteeName: '홍길동',
    menteeEmail: 'hong@example.com',
    menteePhoneNum: '01012340001',
    contactEmail: null,
    durationMinutes: 30,
    reservationStartAt: '2026-05-29T19:00:00',
    reservationEndAt: '2026-05-29T19:30:00',
    status: 'CONFIRMED',
    createDate: '2026-05-21T09:00:00',
    questionDeferred: false,
    questionContent: null,
    ...overrides,
  });

describe('sortReservations', () => {
  const a = make({ feedbackId: 1, startDate: '2026-05-29T17:00:00' });
  const b = make({ feedbackId: 2, startDate: '2026-05-29T18:00:00' });
  const c = make({ feedbackId: 3, startDate: '2026-05-28T10:00:00' });

  it('날짜·시간 오름차순 정렬', () => {
    const result = sortReservations([a, b, c], {
      key: 'dateTime',
      direction: 'asc',
    });
    expect(result.map(rowKey)).toEqual([
      'challenge-3',
      'challenge-1',
      'challenge-2',
    ]);
  });

  it('날짜·시간 내림차순 정렬', () => {
    const result = sortReservations([a, b, c], {
      key: 'dateTime',
      direction: 'desc',
    });
    expect(result.map(rowKey)).toEqual([
      'challenge-2',
      'challenge-1',
      'challenge-3',
    ]);
  });

  it('두 유형이 섞여도 예약 일시 하나로 정렬한다', () => {
    const result = sortReservations(
      [b, makeLiveMentoring({ reservationStartAt: '2026-05-29T16:00:00' }), a],
      { key: 'dateTime', direction: 'asc' },
    );
    expect(result.map(rowKey)).toEqual([
      'live-mentoring-501',
      'challenge-1',
      'challenge-2',
    ]);
  });

  // 슬롯을 잡지 못한 신청이 목록에서 사라지면 운영이 그 건을 볼 방법이 없다.
  it('예약 일시가 없는 1대1 신청도 목록에서 빠지지 않는다', () => {
    const noSlot = makeLiveMentoring({
      applicationId: 502,
      reservationStartAt: null,
      reservationEndAt: null,
    });
    const result = sortReservations([a, noSlot], {
      key: 'dateTime',
      direction: 'asc',
    });
    expect(result.map(rowKey)).toEqual(['live-mentoring-502', 'challenge-1']);
  });

  it('멘티 이름 정렬', () => {
    const x = make({ feedbackId: 1, menteeName: '하늘' });
    const y = make({ feedbackId: 2, menteeName: '가람' });
    const result = sortReservations([x, y], {
      key: 'menteeName',
      direction: 'asc',
    });
    expect(result.map(rowKey)).toEqual(['challenge-2', 'challenge-1']);
  });

  it('신청 시간 정렬', () => {
    const x = make({ feedbackId: 1, createDate: '2026-05-20T09:00:00' });
    const y = make({ feedbackId: 2, createDate: '2026-05-18T09:00:00' });
    const result = sortReservations([x, y], {
      key: 'createDate',
      direction: 'asc',
    });
    expect(result.map(rowKey)).toEqual(['challenge-2', 'challenge-1']);
  });

  it('원본 배열을 변형하지 않는다', () => {
    const list = [a, b, c];
    sortReservations(list, { key: 'dateTime', direction: 'asc' });
    expect(list.map(rowKey)).toEqual([
      'challenge-1',
      'challenge-2',
      'challenge-3',
    ]);
  });
});

describe('filterByMenteeName', () => {
  const list = [
    make({ feedbackId: 1, menteeName: '김멘티' }),
    make({ feedbackId: 2, menteeName: '이멘티' }),
    make({ feedbackId: 3, menteeName: '박학생' }),
    makeLiveMentoring({ menteeName: '최멘티' }),
  ];

  it('빈 검색어면 전체 반환', () => {
    expect(filterByMenteeName(list, '')).toHaveLength(4);
    expect(filterByMenteeName(list, '   ')).toHaveLength(4);
  });

  it('유형과 무관하게 이름 부분 일치로 거른다', () => {
    const result = filterByMenteeName(list, '멘티');
    expect(result.map(rowKey)).toEqual([
      'challenge-1',
      'challenge-2',
      'live-mentoring-501',
    ]);
  });
});
