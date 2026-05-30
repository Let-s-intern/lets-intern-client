'use client';

import posthog from 'posthog-js';
import type { ReactNode } from 'react';

// PostHog 설정 상수. 매직스트링 방지를 위해 상수화.
// defaults: SDK 동작 기본값 버전. PRD §5.1 확정값(2026-01-30 프리셋).
const POSTHOG_DEFAULTS = '2026-01-30';

/**
 * PostHog 초기화 Provider.
 *
 * - env(key)가 없으면 init을 skip 한다(개발/프리뷰 안전).
 * - 전역 싱글톤 `posthog.__loaded`가 중복 init을 막는다(별도 ref 불필요).
 * - Provider만 'use client'이며, children(RSC 포함)은 그대로 통과시킨다.
 */
export default function PostHogProvider({ children }: { children: ReactNode }) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  // SSR에서는 window가 없어 분석 SDK 초기화를 건너뛴다.
  // posthog.init은 `posthog.__loaded` 가드로 멱등하므로 리렌더에 중복 호출되지 않는다.
  if (typeof window !== 'undefined' && posthogKey && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: POSTHOG_DEFAULTS,
      // 세션 리플레이(세션 캡처). 실제 녹화 on/off는 PostHog 프로젝트 설정
      // (Settings → Session Replay → "Record user sessions")에서 켜야 동작한다.
      // 여기서는 개인정보 보호를 위한 마스킹만 지정한다.
      session_recording: {
        // 이력/지원 정보를 다루는 사이트라 모든 입력값을 마스킹한다.
        // (특정 요소만 더 가리려면 해당 DOM에 `ph-no-capture` 클래스 부여)
        maskAllInputs: true,
      },
    });
  }

  return children;
}
