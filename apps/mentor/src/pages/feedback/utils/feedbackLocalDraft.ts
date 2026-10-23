/**
 * 서면 피드백 로컬 초안 — 서버에 저장되기 전의 작성 내용을 브라우저에 보관한다.
 * 새로고침·탭 닫힘·로그인 만료로 에디터가 사라져도 복원하기 위함.
 *
 * 서버 저장과는 별개다. 서버에 저장되면(자동·임시저장·제출) 로컬 초안은 지운다.
 * 시크릿 모드·용량 초과·저장소 차단에서는 던지지 않고 조용히 건너뛴다 — 로컬 초안은
 * 보조 수단이라 실패가 작성 흐름을 막으면 안 된다.
 */

const DRAFT_KEY_PREFIX = 'mentor-feedback-draft:';

/** 이보다 오래된 초안은 복원하지 않는다. 서버 저장본이 그 사이 바뀌었을 가능성이 크다. */
export const FEEDBACK_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredDraft {
  content: string;
  savedAt: number;
}

const draftKey = (attendanceId: number) => `${DRAFT_KEY_PREFIX}${attendanceId}`;

export function loadFeedbackDraft(attendanceId: number): string | null {
  try {
    const raw = window.localStorage.getItem(draftKey(attendanceId));
    if (raw == null) return null;
    const draft = JSON.parse(raw) as Partial<StoredDraft>;
    if (
      typeof draft?.content !== 'string' ||
      typeof draft.savedAt !== 'number' ||
      Date.now() - draft.savedAt > FEEDBACK_DRAFT_TTL_MS
    ) {
      clearFeedbackDraft(attendanceId);
      return null;
    }
    return draft.content;
  } catch {
    return null;
  }
}

export function saveFeedbackDraft(attendanceId: number, content: string) {
  try {
    const draft: StoredDraft = { content, savedAt: Date.now() };
    window.localStorage.setItem(draftKey(attendanceId), JSON.stringify(draft));
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
