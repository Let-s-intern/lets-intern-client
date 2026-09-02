/**
 * 1대1 세션 입장 리드타임 — 시작 20분 전부터 입장 가능.
 *
 * 라이브 피드백(`@/domain/live-feedback/constants/live.ts`)과 같은 값이다.
 * `.claude/rules/core.md` 에 따라 임포트로 공유하지 않고 값만 맞춰 각 도메인에
 * 따로 둔다 — 두 화면이 다른 리드타임을 쓰면 멘토가 한쪽에서만 이르게 입장할 수
 * 있는 이유를 알 수 없다.
 */
export const LIVE_ENTER_LEAD_MS = 20 * 60 * 1000;
