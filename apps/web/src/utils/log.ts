/**
 * §8.1 — Sentry Logs 도메인 wrapper.
 *
 * 모든 wrapper는 `Sentry.logger.{trace,info,warn,error,fatal}`을 호출한다.
 * Logs UI에서 검색 가능한 안정 message + structured attributes를 emit한다.
 *
 * 호출처는 `console.*`이 아니라 이 파일의 wrapper를 사용해야 한다.
 * (`apps/web/eslint.config.mjs`의 `no-console: 'error'`로 강제)
 */
import * as Sentry from '@sentry/nextjs';

/**
 * §8.1 — API 호출이 1초 이상 걸린 성공 케이스.
 * Logs level: warn.
 */
export function apiSlow(
  method: string,
  url: string,
  durationMs: number,
): void {
  Sentry.logger.warn('api.slow', {
    method,
    url,
    durationMs,
  });
}

/**
 * §8.1 — API 4xx 응답 (FE 코드 버그 또는 잘못된 요청).
 * Logs level: warn.
 */
export function apiClientError(
  method: string,
  url: string,
  status: number,
  errorCode: string,
): void {
  Sentry.logger.warn('api.client_error', {
    method,
    url,
    status,
    errorCode,
  });
}

/**
 * §8.1 — API 5xx 응답 (BE 장애).
 * Logs level: error.
 */
export function apiServerError(
  method: string,
  url: string,
  status: number,
  errorCode: string,
): void {
  Sentry.logger.error('api.server_error', {
    method,
    url,
    status,
    errorCode,
  });
}

/**
 * §8.1 — 로그인 성공.
 * Logs level: info.
 */
export function signinSuccess(method: string, userIdHash: string): void {
  Sentry.logger.info('auth.signin.success', {
    method,
    userIdHash,
  });
}

/**
 * §8.1 — 로그인 실패 (잘못된 자격증명 등).
 * Logs level: warn.
 */
export function signinReject(
  method: string,
  reason: string,
  status: number | undefined,
): void {
  Sentry.logger.warn('auth.signin.reject', {
    method,
    reason,
    ...(typeof status === 'number' && { status }),
  });
}

/**
 * §8.1 — 소셜 로그인 콜백 에러.
 * Logs level: error.
 */
export function socialCallbackError(
  provider: string,
  errorCode: string,
): void {
  Sentry.logger.error('auth.social.callback_error', {
    provider,
    errorCode,
  });
}

/**
 * §8.1 — ChunkLoadError → 자동 reload 직전.
 * Logs level: info.
 */
export function staleChunkReload(chunkUrl: string): void {
  Sentry.logger.info('app.stale_chunk_reload', {
    chunkUrl,
  });
}

/**
 * §8.1 — RSC 렌더 실패 (`global-error.tsx`에서 캡처된 크래시).
 * Logs level: error.
 */
export function rscRenderFailed(
  digest: string | undefined,
  route: string | undefined,
): void {
  Sentry.logger.error('app.rsc_render_failed', {
    ...(digest !== undefined && { digest }),
    ...(route !== undefined && { route }),
  });
}

/**
 * §8.1 — Replay buffer가 크래시로 flush된 시점.
 * Logs level: info.
 */
export function replayFlushed(
  replayId: string | undefined,
  errorCode: string | undefined,
): void {
  Sentry.logger.info('replay.flushed', {
    ...(replayId !== undefined && { replayId }),
    ...(errorCode !== undefined && { errorCode }),
  });
}
