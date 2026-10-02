// 개편 시안 12 — 마지막 CTA. PRD 4.12.
//
// 페이지를 닫는 자리다. 위에서 본 것을 한 줄 흐름으로 되짚고(칩 6개) 가격과 버튼으로 끝낸다.
// 가격은 여기 적지 않는다 — `useMembershipChallengeData().salePrice` 가 이긴다.

/** 흐름 칩 한 개. 마지막 칩만 채워진 파랑이다 */
export interface FinalCtaChip {
  label: string;
  /** 도착점 표시 — 채운 배경과 앞의 아이콘이 붙는다 */
  goal?: boolean;
  /** goal 칩 앞 아이콘 */
  icon?: string;
}

export const FINAL_CTA = {
  anchorId: 'final-cta',
  /**
   * 무료 진단에서 취뽀까지. 이 페이지가 위에서 아래로 보여준 것과 같은 순서다 —
   * 섞으면 방금 읽은 흐름과 어긋난다.
   */
  chips: [
    { label: '무료 진단' },
    { label: '마케팅 올인원 패스' },
    { label: '패스 전용 10주 플레이북' },
    { label: '챌린지 · 세미나 · 멘토링' },
    { label: '실제 지원 · 면접' },
    { label: '마케터 취뽀', goal: true, icon: '🎉' },
  ] satisfies FinalCtaChip[],
  titleLines: ['마케팅 취준,', '이제 뭘 해야 할지 고민하지 마세요.'],
  descLines: [
    '내 경험부터 진단하고,',
    '나에게 필요한 준비를 골라',
    '10주 동안 마케터 취뽀까지 준비하세요.',
  ],
  /** 가격 한 줄 앞에 붙는 상품명 */
  priceLabel: '마케팅 올인원 패스',
  ctaLabel: '마케팅 올인원 패스 시작하기',
  /** 버튼 아래 포함 항목 한 줄. `strong` 만 굵다 */
  includes: {
    lead: '챌린지 자유 참여 · 가이드북 7종 · 현직자 세미나 & VOD · 1:1 멘토링 · ',
    strong: '패스 참여자 전용 10주 플레이북',
    tail: ' 포함',
  },
} as const;
