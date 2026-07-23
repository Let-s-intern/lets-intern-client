'use client';

import { useEffect, useState } from 'react';

/**
 * MSW 부트스트랩 Provider.
 *
 * - `NEXT_PUBLIC_API_MOCKING=enabled` 일 때만 worker.start() 실행
 * - mock 활성화 시 worker 준비 완료까지 children 렌더 지연 (mock 미스 방지)
 * - 비활성화 시 즉시 children 렌더 (성능 영향 0)
 *
 * 활성화 방법: `pnpm dev:mock` 또는 `pnpm dev:mock:web`
 */
const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

// 모듈 레벨로 메모이즈: React Strict Mode(dev)가 effect를 두 번 실행해도
// worker.start()는 한 번만 호출되도록 promise를 공유한다. 그렇지 않으면
// 이미 시작된 MSW worker에 재차 start()를 호출해 "already enabled" 에러가 난다.
let startPromise: Promise<void> | null = null;

const startMswWorker = () => {
  if (!startPromise) {
    startPromise = (async () => {
      const { worker } = await import('@letscareer/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      });
    })();
  }
  return startPromise;
};

const MswProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    let cancelled = false;
    startMswWorker().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
};

export default MswProvider;
