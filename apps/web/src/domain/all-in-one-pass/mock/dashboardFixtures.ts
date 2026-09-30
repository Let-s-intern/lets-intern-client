import type { AllInOnePassApplication, PassCalendarEvent } from '../types';

/** 내가 구매한 올인원패스 1건 — 남은기간·이용권 카드용 */
export const myPassFixture: AllInOnePassApplication = {
  id: 1,
  passTitle: '2026 하반기 올인원패스',
  startDate: '2026-08-30T00:00:00',
  endDate: '2026-11-28T23:59:59',
  plan: {
    id: 1,
    title: '마케팅 취준 올인원패스',
    description: null,
    price: 490000,
    discount: 100000,
    privileges: [
      {
        id: 1,
        programType: 'CHALLENGE',
        privilegeType: 'ALL_IN_ONE',
        programCount: 10,
      },
      {
        id: 2,
        programType: 'GUIDEBOOK',
        privilegeType: 'ALL_IN_ONE',
        programCount: 6,
      },
      {
        id: 3,
        programType: 'VOD',
        privilegeType: 'ALL_IN_ONE',
        programCount: 20,
      },
    ],
  },
  mentoringCoupons: [{ name: '1:1 LIVE 멘토링 50% 할인 쿠폰', count: 1 }],
};

/**
 * 대시보드 일정 캘린더 — 챌린지 막대(참여중/참여가능) + 세미나/마일스톤 칩.
 * 기본 뷰가 금일 기준이라 오늘(2026-09-30) 주변으로 배치. 10/1에 이벤트를 몰아 오버플로 확인.
 */
const CHALLENGE_DESC =
  '프로그램 설명 입니다. 공백포함 47자 글자수 제한합니다. 프로그램 설명 입니다.';

export const calendarFixtures: PassCalendarEvent[] = [
  {
    id: 1,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '자기소개서 완성 챌린지',
    description: CHALLENGE_DESC,
    startDate: '2026-09-21T00:00:00',
    endDate: '2026-10-03T23:59:59',
    status: 'IN_PROGRESS',
    url: null,
  },
  {
    id: 2,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '커리어 로드맵 챌린지',
    description: CHALLENGE_DESC,
    startDate: '2026-09-28T00:00:00',
    endDate: '2026-09-30T23:59:59',
    status: 'IN_PROGRESS',
    url: null,
  },
  {
    id: 3,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '면접 대비 챌린지',
    description: CHALLENGE_DESC,
    startDate: '2026-09-30T00:00:00',
    endDate: '2026-10-08T23:59:59',
    status: 'BEFORE',
    url: null,
  },
  {
    id: 4,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '포트폴리오 챌린지',
    description: CHALLENGE_DESC,
    startDate: '2026-10-05T00:00:00',
    endDate: '2026-10-16T23:59:59',
    status: 'BEFORE',
    url: null,
  },
  {
    id: 5,
    type: 'SEMINAR',
    programType: 'LIVE',
    title: '현직자 취업 세미나',
    description: '현직자에게 직접 듣는 취업 노하우.',
    startDate: '2026-09-30T19:00:00',
    endDate: null,
    status: null,
    url: 'https://letscareer.co.kr',
  },
  // 10/1 — 오버플로(8개 초과) 확인용 묶음
  {
    id: 6,
    type: 'MILESTONE',
    programType: null,
    title: '일반 일정1',
    description: null,
    startDate: '2026-10-01T00:00:00',
    endDate: null,
    status: null,
    url: null,
  },
  {
    id: 6,
    type: 'MILESTONE',
    programType: null,
    title: '일반 일정2',
    description: null,
    startDate: '2026-10-01T00:00:00',
    endDate: null,
    status: null,
    url: null,
  },
  {
    id: 6,
    type: 'MILESTONE',
    programType: null,
    title: '일반 일정3',
    description: null,
    startDate: '2026-10-01T00:00:00',
    endDate: null,
    status: null,
    url: null,
  },
  {
    id: 7,
    type: 'SEMINAR',
    programType: 'LIVE',
    title: '마케팅 직무 세미나',
    description: null,
    startDate: '2026-10-01T14:00:00',
    endDate: null,
    status: null,
    url: 'https://letscareer.co.kr',
  },
  ...Array.from({ length: 2 }, (_, i) => ({
    id: 8 + i,
    type: 'SEMINAR' as const,
    programType: 'LIVE' as const,
    title: `무료 세미나 ${i + 1}`,
    description: null,
    startDate: '2026-10-01T10:00:00',
    endDate: null,
    status: null,
    url: null,
  })),
];
