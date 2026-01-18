// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { normalizeSentryTags } from '@/utils/sentry';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // 에러를 Sentry로 보내기 전에 webhook으로도 전송
  beforeSend(event, hint) {
    // 개발 환경에서는 webhook 전송하지 않음
    if (process.env.NODE_ENV === 'development') {
      return event;
    }

    // 에러 객체가 있는 경우 webhook으로 전송 (클라이언트 사이드는 API 라우트를 통해)
    if (
      hint.originalException instanceof Error &&
      typeof window !== 'undefined'
    ) {
      const error = hint.originalException;

      // 클라이언트 사이드에서는 API 라우트를 통해 전송 (CORS 방지)
      fetch('/api/send-error-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
          },
          url: window.location.href,
          userAgent: navigator.userAgent,
          tags: normalizeSentryTags(event.tags),
          extra: event.extra,
        }),
      }).catch(() => {
        // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
      });
    }

    // Sentry로도 계속 전송
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
