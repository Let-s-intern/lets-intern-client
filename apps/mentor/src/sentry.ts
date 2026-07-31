import * as Sentry from '@sentry/react';

import { classifyNoise, isCrashEvent } from './utils/sentryPolicy';

/**
 * Sentry 초기화. `main.tsx` 의 부트스트랩 **맨 앞**에서 호출한다.
 * 뒤로 밀리면 MSW 부트스트랩·렌더 준비 단계에서 난 에러를 놓친다.
 *
 * 한계: 이 위치로도 **모듈 평가 시점의 에러는 잡지 못한다.** ESM 은 정적 import 를
 * 모두 평가한 뒤에야 모듈 본문을 실행하므로, 엔트리가 정적으로 참조하는 청크가
 * 평가 중 throw 하면 `initSentry()` 줄에 도달조차 하지 못한다. LC-3184 가 정확히
 * 그런 경우였고, 실제로 이 설정을 얹은 빌드로 재현해봐도 이벤트가 남지 않았다.
 * 그 계층까지 덮으려면 index.html 에 Sentry Loader Script 를 module 번들보다 먼저
 * 두어야 한다 — 별도 과제다.
 *
 * DSN 이 없으면 SDK 는 조용히 no-op 이므로 로컬 개발에는 지장이 없다.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_PROFILE ?? 'development',

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        // 크래시일 때만 buffer 를 flush 한다.
        beforeErrorSampling: isCrashEvent,
      }),
      // throw 된 에러·처리되지 않은 rejection 자동 캡처.
      Sentry.globalHandlersIntegration({
        onerror: true,
        onunhandledrejection: true,
      }),
    ],

    // 멘토 대상 도구라 트래픽이 적다. 전량 수집해도 쿼터 부담이 없고,
    // 표본이 적을수록 개별 트레이스의 가치가 크다.
    tracesSampleRate: 1,

    // 세션 녹화는 끄고 에러 발생 시에만 올린다. 세션 샘플링을 올리는 것은
    // 과금이 늘어나는 결정이라 별도 판단이 필요하다.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,

    sendDefaultPii: false,

    beforeSend(event, hint) {
      // 노이즈는 버리지 않고 태그만 붙여 격리한다. 대시보드에서 걸러 보되,
      // 빈도가 늘어나는지는 계속 보여야 하기 때문이다.
      if (hint.originalException instanceof Error) {
        const noise = classifyNoise(hint.originalException);
        if (noise) {
          event.tags = { ...event.tags, noise };
        }
      }
      return event;
    },
  });
}
