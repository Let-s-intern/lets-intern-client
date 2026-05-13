// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { isCrashEvent } from './src/utils/replayCrashFilter';
import { normalizeSentryTags, classifyNoise } from './src/utils/sentry';
import { shouldSendLog } from './src/utils/sentryLogSampler';
import { sendErrorToWebhook } from './src/utils/webhook';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // §8.2 — Logs ingestion 비용 보호: trace/debug 1%, info 5%, warn 이상 100%
  beforeSendLog: (log) => (shouldSendLog(log.level) ? log : null),

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // 에러를 Sentry 로는 모두 전송하되, Slack webhook 은 사용자 영향 큰 crash 만.
  // 클라이언트(instrumentation-client.ts) 정책과 일치시켜 server / client 비대칭 제거.
  // 정책:
  //  - production 외 (preview/dev)         → Slack 차단
  //  - noise 분류 (번역기/지갑/stale-chunk) → Slack 차단 (Sentry 태그만 부착)
  //  - non-crash (catch 가능한 일반 BE 에러) → Slack 차단 (Sentry 대시보드만)
  //  - production + crash + non-noise       → Slack 발송
  // crash 기준은 isCrashEvent (replayCrashFilter.ts):
  //   level=fatal / unhandled / server-component / ChunkLoadError / *_PARSE
  //
  // 변경 사유: BE 5xx 응답이 RSC catch 블록 안에서 처리되어도 axios throw 시점에
  //   Sentry server SDK 가 자동 캡처하여 events 가 만들어지고, 기존 server beforeSend
  //   는 production 이면 무조건 Slack 으로 발송했음. 결과적으로 동일한 BE 5xx 가
  //   매번 운영 Slack 에 알림되어 진짜 crash 알림이 묻히는 cry-wolf 상황 발생.
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
      hint.originalException instanceof Error;

    if (shouldSendWebhook) {
      const error = hint.originalException as Error;

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
          sentryEventId: event.event_id,
          release: event.release,
          environment: event.environment,
        },
      }).catch((webhookError) => {
        // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
        console.error('[Sentry Server] Webhook 전송 실패:', webhookError);
      });
    }

    // Sentry 로는 모든 이벤트 그대로 전송 (대시보드 가시성 유지)
    return event;
  },
});
