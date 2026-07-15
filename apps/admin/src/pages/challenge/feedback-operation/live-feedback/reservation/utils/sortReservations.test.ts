import { describe, expect, it } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { filterByMenteeName, sortReservations } from './sortReservations';

const make = (overrides: Partial<FeedbackAdminVo>): FeedbackAdminVo => ({
  feedbackId: 1,
  programTitle: '면접준비 챌린지',
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

describe('sortReservations', () => {
  const a = make({ feedbackId: 1, startDate: '2026-05-29T17:00:00' });
  const b = make({ feedbackId: 2, startDate: '2026-05-29T18:00:00' });
  const c = make({ feedbackId: 3, startDate: '2026-05-28T10:00:00' });

  it('날짜·시간 오름차순 정렬', () => {
    const result = sortReservations([a, b, c], {
      key: 'dateTime',
      direction: 'asc',
    });
    expect(result.map((r) => r.feedbackId)).toEqual([3, 1, 2]);
  });

  it('날짜·시간 내림차순 정렬', () => {
    const result = sortReservations([a, b, c], {
      key: 'dateTime',
      direction: 'desc',
    });
    expect(result.map((r) => r.feedbackId)).toEqual([2, 1, 3]);
  });

  it('멘티 이름 정렬', () => {
    const x = make({ feedbackId: 1, menteeName: '하늘' });
    const y = make({ feedbackId: 2, menteeName: '가람' });
    const result = sortReservations([x, y], {
      key: 'menteeName',
      direction: 'asc',
    });
    expect(result.map((r) => r.feedbackId)).toEqual([2, 1]);
  });

  it('신청 시간 정렬', () => {
    const x = make({ feedbackId: 1, createDate: '2026-05-20T09:00:00' });
    const y = make({ feedbackId: 2, createDate: '2026-05-18T09:00:00' });
    const result = sortReservations([x, y], {
      key: 'createDate',
      direction: 'asc',
    });
    expect(result.map((r) => r.feedbackId)).toEqual([2, 1]);
  });

  it('원본 배열을 변형하지 않는다', () => {
    const list = [a, b, c];
    sortReservations(list, { key: 'dateTime', direction: 'asc' });
    expect(list.map((r) => r.feedbackId)).toEqual([1, 2, 3]);
  });
});

describe('filterByMenteeName', () => {
  const list = [
    make({ feedbackId: 1, menteeName: '김멘티' }),
    make({ feedbackId: 2, menteeName: '이멘티' }),
    make({ feedbackId: 3, menteeName: '박학생' }),
  ];

  it('빈 검색어면 전체 반환', () => {
    expect(filterByMenteeName(list, '')).toHaveLength(3);
    expect(filterByMenteeName(list, '   ')).toHaveLength(3);
  });

  it('이름 부분 일치 필터', () => {
    const result = filterByMenteeName(list, '멘티');
    expect(result.map((r) => r.feedbackId)).toEqual([1, 2]);
  });
});
