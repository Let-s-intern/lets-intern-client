// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { classifyNoise } from '@/utils/sentry';
import { isCrashEvent } from '@/utils/replayCrashFilter';
import { shouldSendLog } from '@/utils/sentryLogSampler';
import { apiSlow, apiClientError, apiServerError } from '@/utils/log';
import { setFetchJsonStartSpan, setFetchJsonLogger } from '@letscareer/api';
import * as Sentry from '@sentry/nextjs';

// §7.1 — fetchJson을 'api.fetch' op span으로 자동 wrapping (브라우저 측).
setFetchJsonStartSpan(Sentry.startSpan);

// §8.4 — fetchJson 결과를 Sentry Logs로 emit하기 위한 logger 주입 (브라우저 측).
setFetchJsonLogger({ apiSlow, apiClientError, apiServerError });

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      // PII 보호 정책 유지
      maskAllText: false,
      blockAllMedia: false,
      // 크래시(fatal/unhandled/server-component/ChunkLoadError/_PARSE)에만 buffer flush
      beforeErrorSampling: isCrashEvent,
    }),
    // 전역 에러 핸들러 활성화 (throw error 자동 캡처)
    Sentry.globalHandlersIntegration({
      onerror: true,
      onunhandledrejection: true,
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // §8.2 — Logs ingestion 비용 보호: trace/debug 1%, info 5%, warn 이상 100%
  beforeSendLog: (log) => (shouldSendLog(log.level) ? log : null),

  // Replay: 전체 세션 녹화 OFF, 크래시 시에만 buffer flush (비용 절감)
  replaysSessionSampleRate: 0,

  // 크래시로 판정된 에러의 100% 업로드 (beforeErrorSampling으로 필터링)
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // noise 분류된 에러는 Sentry 대시보드에서 필터링할 수 있도록 tag 만 부착.
  // (drop 하지 않음 — 운영진이 Sentry UI 에서 noise 별도 보거나 알림 룰에서 제외 가능)
  beforeSend(event, hint) {
    if (hint.originalException instanceof Error) {
      const noise = classifyNoise(hint.originalException);
      if (noise) {
        event.tags = { ...event.tags, noise };
      }
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
