import { PassFormInput } from '@/domain/all-in-one-pass/types';
import { passFixtures } from './passFixtures';

/**
 * 상세(수정 폼) mock 시드. 목록 시드(passFixtures)의 기본 정보를 그대로 쓰고,
 * 폼 전용 필드(플랜·캘린더·링크·상세콘텐츠·혜택)를 덧붙인다.
 * 실제 API가 나오면 이 파일과 store/훅을 삭제하면 된다.
 */

/** 목록 시드에서 기본 정보(제목·구매기간·패스기간)를 가져온다 */
const base = (id: number) => {
  const item = passFixtures.find((p) => p.id === id);
  return {
    title: item?.title ?? '',
    purchaseStartDate: item?.purchaseStartDate ?? null,
    purchaseEndDate: item?.purchaseEndDate ?? null,
    passDays: item?.passDays ?? null,
  };
};

export const passDetailFixtures: Record<number, PassFormInput> = {
  1: {
    ...base(1),
    shortDescription: '취업 준비의 모든 것을 하나의 패스로',
    thumbnailUrl: null,
    plans: [
      {
        id: 'plan-1-basic',
        name: '베이직',
        description: '챌린지 + 가이드북 이용권',
        permissions: ['CHALLENGE_ALL_IN_ONE', 'GUIDEBOOK_ALL_IN_ONE'],
        regularPrice: 299000,
        discountPrice: 199000,
      },
      {
        id: 'plan-1-pro',
        name: '프로',
        description: '전체 권한 + VOD 20종',
        permissions: [
          'CHALLENGE_ALL_IN_ONE',
          'GUIDEBOOK_ALL_IN_ONE',
          'VOD_ALL_IN_ONE',
        ],
        regularPrice: 499000,
        discountPrice: 349000,
      },
    ],
    calendarEvents: [
      {
        id: 'event-1-seminar',
        date: '2026-08-05T19:00:00',
        type: 'SEMINAR',
        title: '자기소개서 오프닝 세미나',
        url: 'https://example.com/seminar',
      },
      {
        id: 'event-1-milestone',
        date: '2026-08-20T00:00:00',
        type: 'MILESTONE',
        title: '렛커 하반기 설명회',
        url: null,
      },
    ],
    externalLinks: [
      {
        id: 'link-1-notion',
        name: '플레이북',
        url: 'https://example.com/playbook',
      },
    ],
    detailContent: null,
    benefits: [
      {
        id: 'benefit-1-coffee',
        isVisible: true,
        category: '제휴 혜택',
        thumbnailUrl: null,
        title: '커피챗 50% 쿠폰 2매',
        link: 'https://www.letscareer.co.kr/coffeechat',
      },
    ],
    faqs: [
      {
        id: 'faq-1-refund',
        category: '신청/환불',
        question: '패스 구매 후 환불이 가능한가요?',
        answer: '구매일로부터 7일 이내, 미이용 시 전액 환불이 가능합니다.',
      },
      {
        id: 'faq-1-period',
        category: '이용 방법',
        question: '패스 기간은 언제부터 시작되나요?',
        answer: '결제 완료 시점부터 패스 기간이 시작됩니다.',
      },
    ],
  },
  2: {
    ...base(2),
    shortDescription: '겨울방학 집중 취업 대비 패스',
    thumbnailUrl: null,
    plans: [
      {
        id: 'plan-2-basic',
        name: '베이직',
        description: '챌린지 이용권',
        permissions: ['CHALLENGE_ALL_IN_ONE'],
        regularPrice: 199000,
        discountPrice: 149000,
      },
    ],
    calendarEvents: [],
    externalLinks: [],
    detailContent: null,
    benefits: [],
    faqs: [],
  },
  3: {
    ...base(3),
    shortDescription: '상반기 공채 대비 올인원패스',
    thumbnailUrl: null,
    plans: [
      {
        id: 'plan-3-basic',
        name: '베이직',
        description: '챌린지 + 가이드북 이용권',
        permissions: ['CHALLENGE_ALL_IN_ONE', 'GUIDEBOOK_ALL_IN_ONE'],
        regularPrice: 299000,
        discountPrice: 219000,
      },
    ],
    calendarEvents: [],
    externalLinks: [],
    detailContent: null,
    benefits: [],
    faqs: [],
  },
};
