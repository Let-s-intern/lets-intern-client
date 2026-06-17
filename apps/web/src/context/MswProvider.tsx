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

const MswProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    let cancelled = false;
    (async () => {
      const { worker } = await import('@letscareer/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      });
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
};

export default MswProvider;
