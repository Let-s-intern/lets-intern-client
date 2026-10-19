/**
 * 서면 피드백 로컬 초안 — 서버 임시저장(IN_PROGRESS)을 누르기 전의 작성 내용을
 * 브라우저에 보관한다. 새로고침·탭 닫힘·로그인 만료로 에디터가 사라져도 복원하기 위함.
 *
 * 서버 임시저장과는 별개다. 서버에 저장되면(임시저장·제출) 로컬 초안은 지운다.
 * 시크릿 모드·용량 초과·저장소 차단에서는 던지지 않고 조용히 건너뛴다 — 로컬 초안은
 * 보조 수단이라 실패가 작성 흐름을 막으면 안 된다.
 */

const DRAFT_KEY_PREFIX = 'mentor-feedback-draft:';

const draftKey = (attendanceId: number) => `${DRAFT_KEY_PREFIX}${attendanceId}`;

export function loadFeedbackDraft(attendanceId: number): string | null {
  try {
    return window.localStorage.getItem(draftKey(attendanceId));
  } catch {
    return null;
  }
}

export function saveFeedbackDraft(attendanceId: number, content: string) {
  try {
    window.localStorage.setItem(draftKey(attendanceId), content);
  } catch {
    // 저장 불가 환경 — 로컬 초안만 포기한다.
  }
}

export function clearFeedbackDraft(attendanceId: number) {
  try {
    window.localStorage.removeItem(draftKey(attendanceId));
  } catch {
    // 위와 같다.
  }
}
