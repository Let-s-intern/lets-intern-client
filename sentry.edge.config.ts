// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { sendErrorToWebhook } from './src/utils/webhook';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // 에러를 Sentry로 보내기 전에 webhook으로도 전송
  beforeSend(event, hint) {
    // 개발 환경에서는 webhook 전송하지 않음
    if (process.env.NODE_ENV === 'development') {
      return event;
    }

    // 에러 객체가 있는 경우 webhook으로 전송
    if (hint.originalException instanceof Error) {
      const error = hint.originalException;
      sendErrorToWebhook(error, {
        tags: event.tags
          ? (Object.fromEntries(
              Object.entries(event.tags).map(([key, value]) => [
                key,
                value?.toString() ?? null,
              ]),
            ) as Record<string, string | number | boolean | null | undefined>)
          : undefined,
        extra: event.extra,
      }).catch(() => {
        // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
      });
    }

    // Sentry로도 계속 전송
    return event;
  },
});
