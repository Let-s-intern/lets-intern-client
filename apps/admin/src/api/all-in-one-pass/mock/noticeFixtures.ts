import { AllInOnePassNotice } from '@/domain/all-in-one-pass/types';

export const noticeFixtures: AllInOnePassNotice[] = [
  {
    id: 1,
    type: 'NOTICE',
    title: '올인원패스 이용 안내',
    content:
      '올인원패스 이용 기간 동안 포함된 프로그램을 자유롭게 이용하실 수 있습니다.',
    createdAt: '2026-08-01T10:00:00',
    linkedPassIds: [1, 2],
  },
  {
    id: 2,
    type: 'GUIDE',
    title: '[필독] 챌린지 참여 가이드',
    content:
      '챌린지는 나의 패스 이용 탭에서 참여하기 버튼으로 신청할 수 있습니다.',
    createdAt: '2026-08-03T14:30:00',
    linkedPassIds: [1],
  },
  {
    id: 3,
    type: 'NOTICE',
    title: '추석 연휴 고객센터 운영 안내',
    content: '추석 연휴 기간 고객센터 운영이 일시 중단됩니다.',
    createdAt: '2026-09-10T09:00:00',
    linkedPassIds: [],
  },
];
