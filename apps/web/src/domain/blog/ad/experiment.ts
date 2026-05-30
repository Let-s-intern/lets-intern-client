// 블로그 팝업 스크롤 트리거 A/B 실험 상수·파서·capture 헬퍼.
// PostHog 콘솔의 Experiment 설정과 1:1로 맞아야 하는 "계약". 매직스트링을 한곳에 모은다.
// (Vercel: 직접 import — 배럴 파일 금지)

import posthog from 'posthog-js';

/** PostHog Feature Flag 키 (콘솔 Experiment 키와 동일해야 함). */
export const BLOG_POPUP_FLAG_KEY = 'blog-popup-scroll-trigger';

/**
 * 플래그/페이로드가 없거나 깨졌을 때의 트리거 임계값(본문 읽기 진행률).
 * 현행(Push 1 이전) 동작과 동일한 60%. 플래그 OFF = 현행 복귀(킬 스위치).
 */
export const FALLBACK_TRIGGER_RATIO = 0.6;

/** 실험 이벤트명 (PostHog Live Events / 대시보드에서 집계되는 이름). */
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
 * 플래그 페이로드에서 트리거 임계값(ratio)을 안전하게 파싱한다.
 *
 * - 정상: `{ ratio: number }` 형태이고 ratio가 (0, 1] 범위면 그대로 사용.
 * - 누락/타입오류/범위이탈/SDK 미로딩(undefined): `FALLBACK_TRIGGER_RATIO`(0.6).
 *
 * 순수 함수 — 입력만으로 출력이 결정된다(단위 테스트 대상).
 */
export function parseTriggerRatio(payload: unknown): number {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('ratio' in payload)
  ) {
    return FALLBACK_TRIGGER_RATIO;
  }

  const ratio = (payload as { ratio: unknown }).ratio;

  if (typeof ratio !== 'number' || !Number.isFinite(ratio)) {
    return FALLBACK_TRIGGER_RATIO;
  }

  if (ratio <= 0 || ratio > 1) {
    return FALLBACK_TRIGGER_RATIO;
  }

  return ratio;
}

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

/** 모든 실험 이벤트에 공통으로 붙는 식별 properties. */
interface ExperimentContext {
  variant: string | null;
  blogId: string | null;
}

/**
 * 실험 이벤트 capture 헬퍼.
 *
 * - 공통 properties(`variant`, `blog_id`)를 한곳에서 주입해 핸들러 중복 제거.
 * - SDK 미초기화(env 미설정) 시 `posthog.__loaded`가 falsy → no-op(앱이 깨지지 않음).
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
    variant: context.variant,
    blog_id: context.blogId,
    ...extra,
  });
}
