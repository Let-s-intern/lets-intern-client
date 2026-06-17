// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { normalizeSentryTags, classifyNoise } from '@/utils/sentry';
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

  // 에러를 Sentry로는 모두 전송하되, Slack webhook 은 사용자 영향 큰 crash 만.
  // 정책:
  //  - production 외 (preview/dev)         → Slack 차단
  //  - noise 분류 (번역기/지갑/stale-chunk) → Slack 차단 (Sentry 태그만 부착)
  //  - non-crash (일반 catch 가능 에러)     → Slack 차단 (Sentry 대시보드만)
  //  - production + crash + non-noise       → Slack 발송
  // crash 기준은 isCrashEvent (replayCrashFilter.ts):
  //   level=fatal / unhandled / server-component / ChunkLoadError / *_PARSE
  beforeSend(event, hint) {
    // noise 분류 태그 부착 (Sentry 대시보드 필터링용 — drop X)
    let isNoise = false;
    if (hint.originalException instanceof Error) {
      const noise = classifyNoise(hint.originalException);
      if (noise) {
        event.tags = { ...event.tags, noise };
        isNoise = true;
      }
    }

    const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    const isCrash = isCrashEvent(event);
    const shouldSendWebhook =
      isProduction &&
      isCrash &&
      !isNoise &&
      hint.originalException instanceof Error &&
      typeof window !== 'undefined';

    if (shouldSendWebhook) {
      const error = hint.originalException as Error;
      // 클라이언트 사이드에서는 API 라우트를 통해 전송 (CORS 방지)
      fetch('/api/send-error-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    // Sentry 로는 모든 이벤트 그대로 전송 (대시보드 가시성 유지)
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
