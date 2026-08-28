// 단일 올패스 플랜 "표시" 데이터.
// 결제 금액은 어드민 챌린지 가격 플랜이 결정한다 — 여기 값은 조회 실패·출시 전에만 쓰는
// 폴백이다. 화면에 실제로 그려지는 값은 useMembershipChallengeData() 가 내려준다.

/**
 * 표시용 가격 폴백 (시안 3.png 기준).
 *
 * 이 숫자가 화면에 보이면 챌린지 조회가 실패했거나 아직 출시 전이라는 뜻이다.
 * 정상 동작 시에는 어드민 BASIC 플랜 가격으로 대체된다.
 *
 * 2026-08-28 현재 연동 챌린지(env `MEMBERSHIP_CHALLENGE_ID`=100000427)가 서버에 없어
 * (`CHALLENGE_NOT_FOUND`) 화면에 실제로 보이는 값이 이 폴백이다. 그래서 가격 변경이
 * 어드민이 아니라 이 파일 수정으로 처리된다. 챌린지가 연결되면 어드민 값이 이긴다.
 */
export const PLAN_PRICE = {
  /** 정가 (취소선) — 개별 구매 합계 */
  original: 938300,
  /** 판매가. 얼리버드(169,900원)는 2026-08-27 로 종료됐다 */
  sale: 184900,
} as const;

export const PLAN_NAME = '하반기 공채 준비 올인원 패스';

/**
 * VOD 옵션 표시용 가격 폴백 (시안 3.png 기준).
 *
 * 챌린지 옵션에서 VOD 옵션을 찾지 못했을 때만 쓴다. 옵션을 못 찾았다는 것은 어드민이
 * 아직 옵션을 안 만들었거나 이름을 다르게 지었다는 뜻이므로, 카드를 비우는 대신 시안
 * 값을 보여주고 결제 시트의 실제 금액이 최종이 되게 한다.
 */
export const VOD_OPTION_PRICE = {
  /** 정가 (취소선) */
  original: 300000,
  /** 판매가 */
  sale: 30000,
} as const;

/** 혜택 아이콘 식별자 — lucide 컴포넌트로 매핑해 렌더한다 */
export type PlanBenefitIcon =
  | 'flag'
  | 'bookOpen'
  | 'workflow'
  | 'users'
  | 'userRoundCheck';

export interface PlanBenefit {
  /** 스캔용 아이콘 식별자(lucide 매핑) */
  icon: PlanBenefitIcon;
  /** 시안 3.png 좌측 한 줄 */
  title: string;
}

/**
 * 포함 혜택 (시안 3.png 좌측 ALL-IN-ONE PASS 목록).
 * "렛츠커리어 커뮤니티"는 뺐다 — 챌린지 참여자도 들어올 수 있어 멤버십 전용 혜택이 아니다.
 */
export const PLAN_BENEFITS: PlanBenefit[] = [
  { icon: 'flag', title: '렛츠커리어 챌린지 10종 베이직 플랜 참여' },
  { icon: 'bookOpen', title: '렛츠커리어 가이드북 6종 제공' },
  { icon: 'workflow', title: '이대로만 따라하면 합격 13주 플레이북' },
  { icon: 'userRoundCheck', title: '1:1 LIVE 멘토링 2회 50%할인권' },
];

/**
 * 표시용 할인율(%) — 정가 대비 특가. 표시 전용이라 반올림 정수로.
 *
 * 정가가 0 이하이거나 특가가 정가보다 비싸면 0 을 돌려준다. 호출부는 0 이면 배지를
 * 렌더하지 않는다 — "0% 할인" 이나 음수 할인율이 화면에 남는 쪽이 더 나쁘다.
 */
export function getDiscountRate(original: number, sale: number): number {
  if (original <= 0) return 0;
  if (sale > original) return 0;
  return Math.round(((original - sale) / original) * 100);
}
