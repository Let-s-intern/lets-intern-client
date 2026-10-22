import type {
  AllInOnePassApplicationDetail,
  PassDescriptionBlob,
} from '../types';

// 신청 상세 응답의 description(JSON) — 캘린더(게릴라/마일스톤)·외부링크·멘토링쿠폰
const descriptionBlob: PassDescriptionBlob = {
  calendarEvents: [
    {
      id: '5c643f9c-3005-4ed2-8d68-c1be0d4a8b26',
      startDate: '2026-10-12T19:00:00',
      endDate: '2026-10-12T21:00:00',
      type: 'GUERRILLA',
      title: '쥬디게릴라',
      url: 'https://www.letscareer.co.kr/',
    },
    {
      id: 'b5446bbe-a16e-48ad-bafa-f1bcca33d91d',
      startDate: '2026-10-19T19:00:00',
      endDate: '2026-10-19T21:00:00',
      type: 'GUERRILLA',
      title: '쥬디게릴라',
      url: 'https://www.letscareer.co.kr/',
    },
    {
      id: 'b5446bbe-a16e-48ad-bafa-f1bcca33d91d',
      startDate: '2026-10-27T19:00:00',
      endDate: '2026-10-27T21:00:00',
      type: 'GUERRILLA',
      title: '쥬디게릴라',
      url: 'https://www.letscareer.co.kr/',
    },
    {
      id: 'a1a1a1a1-0000-0000-0000-000000000001',
      startDate: '2026-10-25T00:00:00',
      endDate: '2026-10-25T23:59:59',
      type: 'MILESTONE',
      title: '중간 점검 마일스톤',
      url: null,
    },
    {
      id: 'a1a1a1a1-0000-0000-0000-000000000001',
      startDate: '2026-11-01T00:00:00',
      endDate: '2026-11-01T23:59:59',
      type: 'MILESTONE',
      title: '중간 점검 마일스톤',
      url: null,
    },
    // 오버플로(+n개) 확인용 — 한 날(10/25)에 8개 이상 몰아둔다
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `overflow-${i}`,
      startDate: '2026-10-28T10:00:00',
      endDate: '2026-10-28T11:00:00',
      type: (i % 2 === 0 ? 'GUERRILLA' : 'MILESTONE') as
        | 'GUERRILLA'
        | 'MILESTONE',
      title: `테스트 일정 ${i + 1}`,
      url: null,
    })),
  ],
  externalLinks: [
    {
      id: 'c0f84cb7-a0da-4dbe-a5d0-941640a587b7',
      name: '플레이북',
      url: 'https://www.letscareer.co.kr/',
    },
    {
      id: 'dfd38cd7-7b2e-4e52-8fd4-d56bb78ce6a8',
      name: '슬랙채널',
      url: 'https://www.letscareer.co.kr/',
    },
  ],
  mentoringCouponAutoIssue: true,
};

/** 내 신청 상세 — 대시보드 단일 소스 (GET /membership-application/{applicationId} 응답 모양) */
export const applicationDetailFixture: AllInOnePassApplicationDetail = {
  membershipApplicationId: 1,
  membershipId: 9,
  title: '올인원패스',
  startDate: '2026-10-09T00:00:00',
  endDate: '2026-10-29T23:59:59',
  periodDays: 20,
  plan: {
    title: '올인원패스 + VOD + LIVE',
    privilegeList: [
      { programType: 'CHALLENGE', privilegeType: 'ALL_IN_ONE' },
      { programType: 'VOD', privilegeType: 'ALL_IN_ONE' },
      { programType: 'GUIDEBOOK', privilegeType: 'ALL_IN_ONE' },
      { programType: 'LIVE', privilegeType: 'ALL_IN_ONE' },
    ],
  },
  description: JSON.stringify(descriptionBlob),
  optionList: [
    {
      membershipOptionId: 1,
      title: '30일 연장',
      extensionDays: 30,
      price: 30000,
      discount: null,
    },
    {
      membershipOptionId: 2,
      title: '60일 연장',
      extensionDays: 60,
      price: 60000,
      discount: null,
    },
    {
      membershipOptionId: 3,
      title: '90일 연장',
      extensionDays: 90,
      price: 90000,
      discount: null,
    },
  ],
};
