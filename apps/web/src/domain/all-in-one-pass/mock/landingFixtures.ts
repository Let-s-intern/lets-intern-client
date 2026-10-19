// 랜딩(구매) 페이지 mock. 어드민 BE 응답 스키마(allInOnePassSchema.ts)의 상세(detail)를
// 공개용으로 깎은 형태다. 실제 유저 공개 조회 API 나오면 이 파일을 삭제하고 api/landing
// queryFn 을 axios 로 교체한다.
//
// 값 규칙(어드민 매퍼 기준):
//   - price = 정가, discount = 할인액(차감 금액). 최종가 = price - discount. 할인 없으면 discount = null.
//   - privilegeType 은 올인원패스라 전부 ALL_IN_ONE. programType 은 4종(CHALLENGE·GUIDEBOOK·VOD·LIVE).
//   - externalLinks 는 url 없이 name 만(비구매자 노출 안전분). landingDescription 은 BE 신규 컬럼.
import type { AllInOnePassLanding } from '../types';

export const landingFixture: AllInOnePassLanding = {
  id: 1,
  title: '2026 하반기 취업 올인원패스',
  introduction:
    '챌린지부터 가이드북·VOD·라이브 클래스까지, 취업 준비 전 과정을 하나로.',
  landingDescription: null, // BE 신규 컬럼(랜딩 전용 렉시컬 JSON). 구조 확정 후 실샘플 교체
  thumbnail: null,
  beginning: '2026-10-01T00:00:00',
  deadline: '2026-11-30T23:59:59',
  periodDays: 180,
  plans: [
    {
      id: 1,
      title: '올인원 플랜',
      description: '챌린지·가이드북·VOD·라이브 클래스 전체 무제한',
      price: 790000,
      discount: 200000,
      privileges: [
        { programType: 'CHALLENGE', privilegeType: 'ALL_IN_ONE' },
        { programType: 'GUIDEBOOK', privilegeType: 'ALL_IN_ONE' },
        { programType: 'VOD', privilegeType: 'ALL_IN_ONE' },
        { programType: 'LIVE', privilegeType: 'ALL_IN_ONE' },
      ],
    },
    {
      id: 2,
      title: '라이트 플랜',
      description: '챌린지·가이드북 무제한',
      price: 390000,
      discount: 100000,
      privileges: [
        { programType: 'CHALLENGE', privilegeType: 'ALL_IN_ONE' },
        { programType: 'GUIDEBOOK', privilegeType: 'ALL_IN_ONE' },
      ],
    },
  ],
  externalLinks: [
    { name: '커뮤니티 슬랙' },
    { name: '취준 플레이북' },
    { name: '오픈채팅방' },
  ],
  faqs: [
    {
      id: 101,
      category: '이용 안내',
      question: '패스 이용 기간은 어떻게 되나요?',
      answer: '구매일로부터 180일간 모든 플랜 프로그램을 이용할 수 있습니다.',
    },
    {
      id: 102,
      category: '이용 안내',
      question: '플랜은 구매 후 변경할 수 있나요?',
      answer:
        '결제한 플랜은 변경이 어려우며, 상위 플랜은 별도 문의가 필요합니다.',
    },
    {
      id: 103,
      category: '환불',
      question: '환불 규정이 궁금해요.',
      answer:
        '이용 시작 전 전액 환불이 가능하며, 이용 시작 후에는 환불 규정에 따릅니다.',
    },
  ],
};
