export type LiveRole = 'MENTOR' | 'MENTEE' | null;

/**
 * URL 경로 세그먼트(`/live-feedback/[role]/...`)에서 역할을 파싱한다.
 *
 * 알림톡은 특정 수신자(멘토 or 멘티)에게 발송되므로 발송 시점에 역할을 알 수 있다.
 * → 링크 경로에 역할을 담아 보내고, FE 는 그 값을 그대로 사용한다(BE myRole 불필요).
 * 알 수 없는 값이면 null 을 반환(라우트에서 notFound 처리).
 */
export function parseRoleParam(param: string): 'MENTOR' | 'MENTEE' | null {
  if (param === 'mentor') return 'MENTOR';
  if (param === 'mentee') return 'MENTEE';
  return null;
}
