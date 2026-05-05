import type { LiveHistory } from '@/schema';

/**
 * 신청 여부 판정.
 *
 * Push 5(웹 라이브 상세 단건 API 전환) 에서 추가됨.
 *
 * - history(/live/{id}/history) 응답이 단일 진실 소스(SoT). 수신했다면 그 값이 우선.
 * - history 미수신(비로그인·로딩 등) 시 기존 application.applied 로 폴백.
 * - 둘 다 없으면 false.
 */
export function getIsAlreadyApplied(
  history: Pick<LiveHistory, 'applied'> | null | undefined,
  application: { applied?: boolean | null } | null | undefined,
): boolean {
  if (history && typeof history.applied === 'boolean') {
    return history.applied;
  }
  return application?.applied ?? false;
}
