import * as Sentry from '@sentry/nextjs';
import { setFetchJsonStartSpan } from '@letscareer/api';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }

  // §7.1 — fetchJson을 'api.fetch' op span으로 자동 wrapping.
  // packages/api는 @sentry/nextjs에 직접 의존하지 않으므로 호스트 앱에서 주입.
  setFetchJsonStartSpan(Sentry.startSpan);
}

export const onRequestError = Sentry.captureRequestError;
