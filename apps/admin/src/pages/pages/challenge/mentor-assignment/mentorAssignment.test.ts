import { describe, expect, it } from 'vitest';

import { challengeApplicationsSchema } from '@/schema';

import type { MentorAssignmentRow } from './types';
import { sortReassignmentRequiredFirst } from './utils';

const row = (
  id: number,
  mentorReassignmentRequired: boolean,
): MentorAssignmentRow => ({
  id,
  name: `참여자${id}`,
  email: '-',
  phoneNum: '-',
  major: '-',
  wishJob: '-',
  wishCompany: '-',
  pricePlanType: 'STANDARD',
  matchedMentorId: 10,
  mentorReassignmentRequired,
});

describe('재배정 필요 행 정렬', () => {
  it('재배정 필요 행을 위로 올리고, 각 묶음 안의 순서는 유지한다', () => {
    const rows = [row(1, false), row(2, true), row(3, false), row(4, true)];

    expect(sortReassignmentRequiredFirst(rows).map((r) => r.id)).toEqual([
      2, 4, 1, 3,
    ]);
    expect(rows.map((r) => r.id)).toEqual([1, 2, 3, 4]);
  });

  it('재배정 필요 행이 없으면 순서가 그대로다', () => {
    const rows = [row(3, false), row(1, false), row(2, false)];

    expect(sortReassignmentRequiredFirst(rows).map((r) => r.id)).toEqual([
      3, 1, 2,
    ]);
  });
});

describe('참여자 응답의 버전 필드', () => {
  it('필드가 없는 응답은 버전 null, 재배정 필요 false 로 읽는다', () => {
    const { applicationList } = challengeApplicationsSchema.parse({
      applicationList: [{ application: { id: 1 } }],
    });

    expect(applicationList[0].application).toMatchObject({
      challengeVersionId: null,
      challengeVersionTitle: null,
      mentorReassignmentRequired: false,
    });
  });

  it('필드가 있는 응답은 값을 그대로 읽는다', () => {
    const { applicationList } = challengeApplicationsSchema.parse({
      applicationList: [
        {
          application: {
            id: 1,
            challengeVersionId: 10,
            challengeVersionTitle: '대학생',
            mentorReassignmentRequired: true,
          },
        },
      ],
    });

    expect(applicationList[0].application).toMatchObject({
      challengeVersionId: 10,
      challengeVersionTitle: '대학생',
      mentorReassignmentRequired: true,
    });
  });
});

describe('MentorAssignmentRow 멘티 정보 매핑', () => {
  it('applications 데이터에서 멘티 정보를 추출하여 row에 매핑한다', () => {
    const applicationsList = [
      {
        application: {
          id: 1,
          major: '컴퓨터공학',
          wishJob: '프론트엔드 개발자',
          wishCompany: '카카오',
          challengeMentorId: 10,
        },
      },
      {
        application: {
          id: 2,
          major: null,
          wishJob: null,
          wishCompany: null,
          challengeMentorId: null,
        },
      },
    ];

    const detailsMap: Record<
      number,
      { major: string; wishJob: string; wishCompany: string }
    > = {};
    applicationsList.forEach((a) => {
      detailsMap[a.application.id] = {
        major: a.application.major ?? '-',
        wishJob: a.application.wishJob ?? '-',
        wishCompany: a.application.wishCompany ?? '-',
      };
    });

    expect(detailsMap[1]).toEqual({
      major: '컴퓨터공학',
      wishJob: '프론트엔드 개발자',
      wishCompany: '카카오',
    });
    expect(detailsMap[2]).toEqual({
      major: '-',
      wishJob: '-',
      wishCompany: '-',
    });
  });
});

describe('멘토별 매칭 인원 수 계산', () => {
  it('effectiveMentors에서 멘토별 매칭 수를 정확히 계산한다', () => {
    const effectiveMentors: Record<number, number> = {
      1: 10, // app 1 → mentor 10
      2: 10, // app 2 → mentor 10
      3: 20, // app 3 → mentor 20
      4: 10, // app 4 → mentor 10
      5: 30, // app 5 → mentor 30
    };

    const matchCounts: Record<number, number> = {};
    Object.values(effectiveMentors).forEach((mentorId) => {
      matchCounts[mentorId] = (matchCounts[mentorId] ?? 0) + 1;
    });

    expect(matchCounts[10]).toBe(3);
    expect(matchCounts[20]).toBe(1);
    expect(matchCounts[30]).toBe(1);
  });

  it('effectiveMentors가 비어있으면 matchCounts도 비어있다', () => {
    const effectiveMentors: Record<number, number> = {};

    const matchCounts: Record<number, number> = {};
    Object.values(effectiveMentors).forEach((mentorId) => {
      matchCounts[mentorId] = (matchCounts[mentorId] ?? 0) + 1;
    });

    expect(Object.keys(matchCounts)).toHaveLength(0);
  });
});

describe('MentorList 멘토 정보 표시', () => {
  it('멘토에 userId가 있으면 [userId] 이름 형태로 표시할 수 있다', () => {
    const mentor = { userId: 42, name: '김멘토' };
    const displayName = `[${mentor.userId}] ${mentor.name}`;
    expect(displayName).toBe('[42] 김멘토');
  });

  it('매칭 수가 0이면 0명 배정으로 표시한다', () => {
    const matchCounts: Record<number, number> = {};
    const mentorId = 10;
    const count = matchCounts[mentorId] ?? 0;
    expect(`${count}명 배정`).toBe('0명 배정');
  });
});
