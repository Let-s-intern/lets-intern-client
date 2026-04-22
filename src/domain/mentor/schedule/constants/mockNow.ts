/**
 * 라이브 피드백 모달 시연용 mock "현재 시각".
 *
 * 목적:
 *  - MenteeList의 "오늘 날짜" 구분 박스 강조 시연
 *  - SessionCountdown의 1시간 전 카운트다운 시연
 *
 * 4/28 08:45 = 이지수 09:00 세션 15분 전 → 카운트다운 노출 + 4/28 "오늘" 강조.
 * 프로덕션에서는 `null`로 설정해 실제 시각을 사용.
 */
export const MOCK_NOW: Date | null = new Date('2026-04-28T08:45:00');

/** mock이 설정되어 있으면 mock을, 아니면 실제 시각을 반환 */
export function currentNow(): Date {
  return MOCK_NOW ? new Date(MOCK_NOW) : new Date();
}
