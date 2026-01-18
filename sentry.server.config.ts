// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { normalizeSentryTags } from './src/utils/sentry';
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

      // 요청 정보 추출 (API 라우트인 경우)
      const requestUrl =
        event.request?.url ||
        (event.contexts?.request?.url as string | undefined) ||
        undefined;

      const userAgent =
        event.request?.headers?.['user-agent'] ||
        (event.contexts?.request?.['user-agent'] as string | undefined) ||
        undefined;

      sendErrorToWebhook(error, {
        url: requestUrl,
        userAgent,
        tags: normalizeSentryTags(event.tags),
        extra: {
          ...event.extra,
          // 추가 컨텍스트 정보
          sentryEventId: event.event_id,
          release: event.release,
          environment: event.environment,
        },
      }).catch((webhookError) => {
        // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
        console.error('[Sentry Server] Webhook 전송 실패:', webhookError);
      });
    }

    // Sentry로도 계속 전송
    return event;
  },
});
