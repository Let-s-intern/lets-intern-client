import type { AllInOnePassNotice } from '../types';

const SAMPLE_BODY = `공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다.

공지 내용입니다.
공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다.
공지 내용입니다. 공지 내용입니다.

바로가기: https://letscareer-playbook.vercel.app/
공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다. 공지 내용입니다.`;

export const noticeFixtures: AllInOnePassNotice[] = [
  {
    id: 1,
    type: 'NOTICE',
    title: '[챌린지] 챌린지 플랜 업그레이드 차액 결제 안내',
    contents: SAMPLE_BODY,
    createDate: '2026-10-11T10:00:00',
  },
  {
    id: 2,
    type: 'NOTICE',
    title: '10월 멘토링 쿠폰 지급 완료 안내',
    contents: SAMPLE_BODY,
    createDate: '2026-10-10T09:00:00',
  },
  {
    id: 3,
    type: 'NOTICE',
    title: '추석 연휴 고객센터 운영 안내',
    contents: SAMPLE_BODY,
    createDate: '2026-09-20T09:00:00',
  },
  {
    id: 4,
    type: 'NOTICE',
    title: '올인원패스 이용 기간 연장 기능 오픈',
    contents: SAMPLE_BODY,
    createDate: '2026-09-05T09:00:00',
  },
  {
    id: 5,
    type: 'GUIDE',
    title: '올인원패스 200% 활용 가이드',
    contents: SAMPLE_BODY,
    createDate: '2026-10-12T09:00:00',
  },
  {
    id: 6,
    type: 'GUIDE',
    title: '챌린지 대시보드 사용법',
    contents: SAMPLE_BODY,
    createDate: '2026-08-30T09:00:00',
  },
];
