export type LiveRole = 'MENTOR' | 'MENTEE' | null;

/**
 * 세션 역할 판별 어댑터.
 *
 * §0.1: 웹 기본 FeedbackVo(GET /feedback/{id})는 "로그인 사용자가 이 feedback 의
 * 멘토/멘티인지"를 직접 알려주지 않는다. BE 가 `myRole` 또는 입장 전용 엔드포인트를
 * 확정하면 그 값을 매핑하고, 확정 전에는 null 을 반환한다(폴백 처리는 컨테이너에서).
 *
 * 순수함수이므로 BE 응답 형태가 정해지면 입력 타입만 넓혀 매핑 로직을 채우면 된다.
 */
// TODO(BE): myRole 확정 시 정식 응답 타입으로 좁힌다. 입장 전용 엔드포인트면 별도 어댑터.
type MaybeRoleSource = { myRole?: 'MENTOR' | 'MENTEE' | null } & Record<
  string,
  unknown
>;

export function resolveMyRole(
  source: MaybeRoleSource | null | undefined,
): LiveRole {
  if (!source) return null;
  if (source.myRole === 'MENTOR' || source.myRole === 'MENTEE') {
    return source.myRole;
  }
  // TODO(BE): myRole 미제공 — BE 확정 전까지 null 스텁.
  return null;
}
