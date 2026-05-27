/**
 * "현재 시각" 추상화 헬퍼.
 *
 * 과거에는 라이브 피드백 모달 시연을 위해 고정 데모 시각(2026-05-04 09:45)을 사용했으나,
 * 목데이터 제거 작업으로 실 API/MSW 기반 렌더로 전환되어 데모 시각 override를 끈다.
 * `MOCK_NOW = null` → `currentNow()`가 항상 실제 시각을 반환한다.
 * (시그니처/소비처는 무변경 — "오늘" 강조·카운트다운이 실제 날짜 기준으로 동작)
 */
export const MOCK_NOW: Date | null = null;

/** mock이 설정되어 있으면 mock을, 아니면 실제 시각을 반환 */
export function currentNow(): Date {
  return MOCK_NOW ? new Date(MOCK_NOW) : new Date();
}
