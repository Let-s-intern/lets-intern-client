// 블로그 팝업 이벤트명·capture 헬퍼.
// PostHog 대시보드에서 집계되는 이름과 1:1로 맞아야 하는 "계약". 매직스트링을 한곳에 모은다.
// 트리거 임계값은 어드민의 `triggerRatio` 필드에서 온다(피처 플래그 페이로드가 아니다).
// (Vercel: 직접 import — 배럴 파일 금지)

import posthog from 'posthog-js';

/** 팝업 이벤트명 (PostHog Live Events / 대시보드에서 집계되는 이름). */
export const BLOG_POPUP_EVENTS = {
  shown: 'blog_popup_shown',
  ctaClicked: 'blog_popup_cta_clicked',
  dismissed: 'blog_popup_dismissed',
} as const;

/** 이탈(dismiss) 사유 — footer 버튼 구분. */
export const DISMISS_REASON = {
  close: 'close',
  hideDay: 'hide_day',
} as const;

export type DismissReason =
  (typeof DISMISS_REASON)[keyof typeof DISMISS_REASON];

/**
 * 블로그 상세 경로(`/blog/{id}/{title}`)에서 `blog_id`(첫 세그먼트)를 추출한다.
 * 매칭 실패 시 `null`(이벤트 property는 옵셔널 — 분석 시 무시).
 *
 * 순수 함수 — pathname 문자열만으로 결정(단위 테스트 대상).
 */
export function parseBlogId(pathname: string | null): string | null {
  if (!pathname) return null;

  const match = pathname.match(/^\/blog\/([^/]+)/);
  return match ? match[1] : null;
}

/** 모든 팝업 이벤트에 공통으로 붙는 식별 properties. */
interface ExperimentContext {
  blogId: string | null;
  /** 어드민이 등록한 팝업 id. 어느 크리에이티브가 눌렸는지 구분한다. */
  popupId: number | null;
}

/**
 * 팝업 이벤트 capture 헬퍼.
 *
 * - 공통 properties(`blog_id`, `popup_id`)를 한곳에서 주입해 핸들러 중복 제거.
 * - SDK 미초기화(env 미설정) 시 `posthog.__loaded`가 falsy → no-op(앱이 깨지지 않음).
 *
 * 클릭률의 원본은 서버 카운터다. 이 이벤트는 세그먼트 분석용으로 병행한다.
 *
 * @param event 이벤트명 (`BLOG_POPUP_EVENTS`)
 * @param context 공통 식별값
 * @param extra 이벤트별 추가 properties (예: shown의 `trigger_ratio`, dismissed의 `reason`)
 */
export function captureExperimentEvent(
  event: (typeof BLOG_POPUP_EVENTS)[keyof typeof BLOG_POPUP_EVENTS],
  context: ExperimentContext,
  extra?: Record<string, unknown>,
): void {
  if (!posthog.__loaded) return;

  posthog.capture(event, {
    blog_id: context.blogId,
    popup_id: context.popupId,
    ...extra,
  });
}
