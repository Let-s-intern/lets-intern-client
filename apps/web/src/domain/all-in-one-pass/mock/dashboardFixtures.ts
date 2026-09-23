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

/** 대시보드 일정 캘린더 — 챌린지 막대 + 세미나 칩 + 마일스톤 */
export const calendarFixtures: PassCalendarEvent[] = [
  {
    id: 1,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '자기소개서 완성 챌린지',
    description: '2주간 매일 미션을 수행하며 자소서를 완성합니다.',
    startDate: '2026-08-31T00:00:00',
    endDate: '2026-09-02T23:59:59',
    status: 'IN_PROGRESS',
    url: null,
  },
  {
    id: 2,
    type: 'SEMINAR',
    programType: 'LIVE',
    title: '현직자 취업 세미나',
    description: null,
    startDate: '2026-09-02T19:00:00',
    endDate: null,
    status: null,
    url: 'https://letscareer.co.kr',
  },
  {
    id: 3,
    type: 'CHALLENGE',
    programType: 'CHALLENGE',
    title: '포트폴리오 챌린지',
    description: '포트폴리오를 완성하는 챌린지입니다.',
    startDate: '2026-09-06T00:00:00',
    endDate: '2026-09-12T23:59:59',
    status: 'BEFORE',
    url: null,
  },
  {
    id: 4,
    type: 'MILESTONE',
    programType: null,
    title: '서류 마감일',
    description: null,
    startDate: '2026-09-07T00:00:00',
    endDate: null,
    status: null,
    url: null,
  },
];
