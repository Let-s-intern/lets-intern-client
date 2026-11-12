/**
 * 쿠폰 미노출 대상 챌린지 타입
 * @note CAREER_START, EXPERIENCE_SUMMARY 타입은 B2B 전용으로 쿠폰 미노출
 *       단, source=b2b 파라미터가 있으면 쿠폰 노출
 */
export const COUPON_DISABLED_CHALLENGE_TYPES = [
  'CAREER_START',
  'EXPERIENCE_SUMMARY',
];

/**
 * 특정 챌린지 타입에서만 쓰게 묶은 쿠폰 코드 → 허용 챌린지 타입 (LC-3611)
 * @note 서버는 쿠폰을 CHALLENGE 같은 큰 분류로만 제한하고 챌린지 타입으로는 못 막는다.
 *       협찬용 전액할인 코드가 다른 챌린지 결제에서 0원이 되지 않게 화면에서 목록에서 뺀다.
 *       YAIREWARD: Y-AI 메이커톤 수상 팀 경험정리 1주 완성 챌린지 수강권, 2027-05 까지
 */
export const CHALLENGE_TYPE_LOCKED_COUPONS: Record<string, string> = {
  YAIREWARD: 'EXPERIENCE_SUMMARY',
};

/** 지금 결제하는 챌린지 타입에서 쓸 수 없는 묶인 쿠폰 코드 목록 */
export function getBlockedCouponCodes(challengeType: string): string[] {
  return Object.entries(CHALLENGE_TYPE_LOCKED_COUPONS)
    .filter(([, allowedType]) => allowedType !== challengeType)
    .map(([code]) => code);
}
