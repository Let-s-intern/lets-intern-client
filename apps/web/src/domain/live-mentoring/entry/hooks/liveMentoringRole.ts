export type LiveMentoringRoleParam = 'MENTOR' | 'MENTEE' | null;

/**
 * URL 경로 세그먼트(`/live-mentoring/[role]/...`)에서 역할을 파싱한다.
 *
 * **이 값은 화면 분기(자동 출석, 상대 출석 체크 바 노출)에 쓰지 않는다.** 알림톡
 * 링크가 준 값이라 사용자가 URL 을 바꿔 자신을 멘토로 위장할 수 있다. 실제 분기는
 * 로그인 후 서버가 판정해 내리는 `LiveMentoringEntry.myRole` 을 쓴다
 * (`@/api/live-mentoring/liveMentoringSchema`).
 *
 * 이 값은 두 곳에만 쓴다 — 경로 유효성 검사(모르는 값이면 404), 그리고 로그인
 * 전 화면의 문구·소셜 로그인 리다이렉트 경로 같은 순수 표시용도.
 */
export function parseLiveMentoringRoleParam(
  param: string,
): LiveMentoringRoleParam {
  if (param === 'mentor') return 'MENTOR';
  if (param === 'mentee') return 'MENTEE';
  return null;
}
