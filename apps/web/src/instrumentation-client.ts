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

  // 에러를 Sentry로 보내기 전에 webhook으로도 전송
  beforeSend(event, hint) {
    // noise 분류 태그 부착 (Sentry 대시보드에는 격리되어 들어감, drop 안 함)
    let noiseCategory: ReturnType<typeof classifyNoise> = null;
    if (hint.originalException instanceof Error) {
      noiseCategory = classifyNoise(hint.originalException);
      if (noiseCategory) {
        event.tags = { ...event.tags, noise: noiseCategory };
      }
    }

    // 사용자 세션 crash (페이지 사용 불가 수준)인지 분류 → tag 부착
    // 이 태그가 있으면 route.ts 의 dedupe 가 우회되어 항상 즉시 Slack 발송.
    const isCrash = isCrashEvent(event);
    if (isCrash) {
      event.tags = { ...event.tags, crash: 'true' };
    }

    // Slack webhook 발송 차단 조건:
    // 1) production 환경이 아니면 무조건 차단 (preview/dev 운영 채널 오염 방지)
    // 2) production 이어도, crash 가 아니고 noise 분류된 경우 차단
    //    (crash 면 noise 라벨과 무관하게 항상 발송 — 사용자 영향 우선)
    //
    // Vercel preview/dev 빌드도 NODE_ENV='production' 으로 빌드되므로
    // NODE_ENV 만으로는 운영 구분이 안 됨. NEXT_PUBLIC_VERCEL_ENV 만을
    // single source of truth 로 사용 (값 없으면 non-production 으로 간주).
    const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    const shouldSkipWebhook =
      !isProduction || (!isCrash && noiseCategory !== null);

    // 에러 객체가 있는 경우 webhook으로 전송 (클라이언트 사이드는 API 라우트를 통해)
    if (
      hint.originalException instanceof Error &&
      typeof window !== 'undefined' &&
      !shouldSkipWebhook
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
