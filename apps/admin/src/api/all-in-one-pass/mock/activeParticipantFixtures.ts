import { ActivePassParticipant } from '@/domain/all-in-one-pass/types';

/**
 * A-8 참여중 유저 mock 시드. 연장 유저(periods 2건 이상)와 여러 패스가 섞인
 * 현재 참여중 목록을 흉내낸다. BE 조회 API가 나오면 이 파일을 삭제한다.
 * (row id = 최신 주문번호 · 라벨은 FE 파생)
 */
export const activeParticipantFixtures: ActivePassParticipant[] = [
  {
    id: 'letsvU266401',
    name: '김민수',
    email: 'minsu.kim@example.com',
    passTitle: '2026 하반기 올인원패스',
    periods: [
      {
        applicationId: 'letsvU266401',
        paidAt: '2026-08-05',
        startDate: '2026-08-05',
        endDate: '2026-11-03',
        price: 99000,
      },
    ],
  },
  {
    id: 'letsvU266412',
    name: '이서연',
    email: 'seoyeon.lee@example.com',
    passTitle: '2026 하반기 올인원패스',
    // 연장 2회 (30일, 120일)
    periods: [
      {
        applicationId: 'letsvU266410',
        paidAt: '2026-07-20',
        startDate: '2026-07-20',
        endDate: '2026-10-18',
        price: 99000,
      },
      {
        applicationId: 'letsvU266411',
        paidAt: '2026-10-11', // 만료(10-18) 7일 전
        startDate: '2026-10-18',
        endDate: '2026-11-17',
        price: 30000,
      },
      {
        applicationId: 'letsvU266412',
        paidAt: '2026-11-14', // 만료(11-17) 3일 전
        startDate: '2026-11-17',
        endDate: '2027-03-17',
        price: 99000,
      },
    ],
  },
  {
    id: 'letsvU266420',
    name: '박지훈',
    email: 'jihun.park@example.com',
    passTitle: '2026 겨울 올인원패스',
    periods: [
      {
        applicationId: 'letsvU266420',
        paidAt: '2026-09-01',
        startDate: '2026-09-01',
        endDate: '2026-11-30',
        price: 99000,
      },
    ],
  },
  {
    id: 'letsvU266495',
    name: '최유진',
    email: 'yujin.choi@example.com',
    passTitle: '2026 겨울 올인원패스',
    // 연장 1회 (30일)
    periods: [
      {
        applicationId: 'letsvU266494',
        paidAt: '2026-09-10',
        startDate: '2026-09-10',
        endDate: '2026-12-09',
        price: 99000,
      },
      {
        applicationId: 'letsvU266495',
        paidAt: '2026-12-09', // 만료(12-09) 당일
        startDate: '2026-12-09',
        endDate: '2027-01-08',
        price: 30000,
      },
    ],
  },
  {
    id: 'letsvU266440',
    name: '정현우',
    email: 'hyunwoo.jung@example.com',
    passTitle: '2026 상반기 올인원패스',
    periods: [
      {
        applicationId: 'letsvU266440',
        paidAt: '2026-10-02',
        startDate: '2026-10-02',
        endDate: '2026-12-31',
        price: 129000,
      },
    ],
  },
  {
    id: 'letsvU266451',
    name: '한소희',
    email: 'sohee.han@example.com',
    passTitle: '2026 상반기 올인원패스',
    // 연장 1회 (90일)
    periods: [
      {
        applicationId: 'letsvU266450',
        paidAt: '2026-10-08',
        startDate: '2026-10-08',
        endDate: '2027-01-06',
        price: 129000,
      },
      {
        applicationId: 'letsvU266451',
        paidAt: '2027-01-07', // 만료(01-06) 1일 후
        startDate: '2027-01-06',
        endDate: '2027-04-06',
        price: 79000,
      },
    ],
  },
];
