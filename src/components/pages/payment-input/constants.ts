/**
 * 쿠폰 미노출 대상 챌린지 타입
 * @note CAREER_START, EXPERIENCE_SUMMARY 타입은 B2B 전용으로 쿠폰 미노출
 *       단, source=b2b 파라미터가 있으면 쿠폰 노출
 */
export const COUPON_DISABLED_CHALLENGE_TYPES = [
  'CAREER_START',
  'EXPERIENCE_SUMMARY',
];
