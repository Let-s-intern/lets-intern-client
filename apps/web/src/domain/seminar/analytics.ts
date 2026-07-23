import posthog from 'posthog-js';

export type SeminarStatusForEvent = 'RECRUITING' | 'POST';

/**
 * 세미나 앵콜 요청 이벤트 캡처(PostHog).
 *
 * - 요청(신청) 시에만 호출한다. 취소는 UI/localStorage만 다루고 캡처하지 않는다.
 * - `user_id`를 실어 PostHog 인사이트에서 "unique by user_id"로 집계하면
 *   전역 identify 없이도 유저 단위 중복이 제거된다(비로그인은 null → 기기 단위).
 * - SDK 미초기화(env 미설정) 시 `posthog.__loaded`가 falsy → no-op(앱이 안 깨짐).
 */
export function captureSeminarEncore(params: {
  seminarId: number;
  seminarTitle: string | null;
  status: SeminarStatusForEvent;
  userId?: number;
}): void {
  if (!posthog.__loaded) return;

  posthog.capture('seminar_encore_requested', {
    seminar_id: params.seminarId,
    seminar_title: params.seminarTitle ?? null,
    status: params.status,
    user_id: params.userId ?? null,
  });
}

/**
 * 세미나 카드 클릭(상세로 이동) 이벤트 캡처(PostHog).
 * status로 모집중(RECRUITING)/모집종료(POST) 클릭을 구분해 비교할 수 있게 한다.
 */
export function captureSeminarCardClick(params: {
  seminarId: number;
  seminarTitle: string | null;
  status: SeminarStatusForEvent;
  userId?: number;
}): void {
  if (!posthog.__loaded) return;

  posthog.capture('seminar_card_clicked', {
    seminar_id: params.seminarId,
    seminar_title: params.seminarTitle ?? null,
    status: params.status,
    user_id: params.userId ?? null,
  });
}

/**
 * 지난 인기 세미나(멘토 하이라이트) 카드 클릭 이벤트 캡처(PostHog).
 * 앵콜(seminar_encore_requested)과 나란히 비교할 수 있게 동일한 user_id 규칙을 쓴다.
 */
export function capturePastSeminarClick(params: {
  mentorId: string;
  mentorName: string;
  videoUrl: string;
  userId?: number;
}): void {
  if (!posthog.__loaded) return;

  posthog.capture('past_seminar_clicked', {
    mentor_id: params.mentorId,
    mentor_name: params.mentorName,
    video_url: params.videoUrl,
    user_id: params.userId ?? null,
  });
}
