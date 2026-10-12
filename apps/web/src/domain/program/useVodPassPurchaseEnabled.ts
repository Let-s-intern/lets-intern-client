'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

/**
 * VOD 이용권 "추가 구매" 노출을 제어하는 PostHog 피처 플래그 키(LC-3438).
 * PostHog 대시보드의 Feature flags 에서 이 키로 만든다.
 */
export const VOD_PASS_PURCHASE_FLAG = 'vod-pass-purchase';

/**
 * 플래그 값을 읽는다. 꺼짐이 기본값이다(fail-closed).
 *
 * - PostHog 미초기화(env 없음)·플래그 미로딩·플래그 미정의·광고 차단으로 요청 실패 → false
 * - 로컬 개발 서버(NODE_ENV=development)에서만, 플래그가 정의되지 않았을 때 true 로 둔다.
 *   QA 중 PostHog 프로젝트에 플래그를 만들지 않아도 카드가 보이게 하기 위해서다.
 *   운영·프리뷰 빌드(production)에서는 이 분기가 동작하지 않는다.
 *   개발 서버에서 꺼짐을 확인하려면 PostHog 에서 플래그를 명시적으로 false 로 둔다.
 */
function readFlag(): boolean {
  const value = posthog.__loaded
    ? posthog.isFeatureEnabled(VOD_PASS_PURCHASE_FLAG)
    : undefined;
  if (value === undefined) return process.env.NODE_ENV === 'development';
  return value === true;
}

/**
 * 결제 시트에 VOD 이용권 선택 카드를 보여줄지 정한다.
 *
 * 이 값은 화면 노출만 막는 클라이언트 스위치다. API 를 직접 호출하는 요청은 막지 못한다.
 * 판매 자체를 막는 하드 스위치는 BE 의 상품 설정(`vod-pass.initial-price`)이다.
 *
 * 서버 렌더와 첫 클라이언트 렌더는 항상 false 다(하이드레이션 불일치 방지).
 * 플래그는 PostHog 가 로드한 뒤 반영되므로 카드가 잠시 뒤에 나타날 수 있다.
 */
export function useVodPassPurchaseEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(readFlag());

    if (!posthog.__loaded) return;
    const unsubscribe = posthog.onFeatureFlags(() => setEnabled(readFlag()));
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return enabled;
}
