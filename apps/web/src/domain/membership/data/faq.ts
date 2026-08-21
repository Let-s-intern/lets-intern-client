// FAQ 섹션 데이터. (기능명세서 9) — membership.ts 에서 이동.

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQ_HEAD = {
  badge: '자주 묻는 질문',
  title: '궁금한 점이 있으신가요?',
} as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 0,
    question: '멤버십 이용 기간은 언제까지인가요?',
    answer:
      '모든 플랜은 2026년 9월 1일부터 11월 30일까지, 3개월간 이용할 수 있어요. 기간 내 모든 혜택을 자유롭게 사용하세요.',
  },
  {
    id: 2,
    question: '환불 규정이 궁금해요.',
    answer:
      '이용 시작 전에는 전액 환불이 가능하며, 이용 시작 후에는 콘텐츠 이용 내역에 따라 관련 법령 기준으로 환불돼요.',
  },
  {
    id: 3,
    question: '중간에 상위 플랜으로 업그레이드할 수 있나요?',
    answer:
      '네, 멤버십 기간 중 차액 결제로 상위 플랜 전환이 가능해요. 자세한 내용은 고객센터로 문의해 주세요.',
  },
];
