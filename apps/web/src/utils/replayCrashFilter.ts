import type * as Sentry from '@sentry/nextjs';

type SentryEvent = Sentry.Event;

/**
 * Sentry Replay buffer를 flush할 "크래시" 이벤트인지 판정합니다.
 * true를 반환하는 이벤트에 대해서만 Replay가 업로드됩니다.
 *
 * 크래시 판정 기준:
 * 1. level === 'fatal'
 * 2. exception.mechanism.handled === false (unhandled rejection/error)
 * 3. tags.kind === 'server-component' (RSC render 실패)
 * 4. exception.type === 'ChunkLoadError' (stale deploy)
 * 5. tags.errorCode ends with '_PARSE' (Schema parse 실패 → 페이지 렌더 불가)
 */
export function isCrashEvent(event: SentryEvent): boolean {
  // 1) fatal level
  if (event.level === 'fatal') return true;

  const exc = event.exception?.values?.[0];

  // 2) unhandled exception
  if (exc?.mechanism?.handled === false) return true;

  // 3) Server Components render 실패
  if (event.tags?.kind === 'server-component') return true;

  // 4) ChunkLoadError
  if (exc?.type === 'ChunkLoadError') return true;

  // 5) Schema parse 실패 (_PARSE suffix)
  const errorCode = event.tags?.errorCode;
  if (typeof errorCode === 'string' && errorCode.endsWith('_PARSE')) return true;

  return false;
}
