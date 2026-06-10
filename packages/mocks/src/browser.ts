import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/**
 * 브라우저 환경용 MSW 워커.
 *
 * 사용처:
 * - Next.js: `apps/web/public/mockServiceWorker.js` 가 root에 등록되어야 동작
 * - Vite:    `apps/mentor/public/mockServiceWorker.js` 동일
 *
 * 활성화 방법은 각 앱의 진입점에서 `worker.start({ onUnhandledRequest: 'bypass' })` 호출.
 */
export const worker = setupWorker(...handlers);
