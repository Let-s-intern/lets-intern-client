import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/**
 * 브라우저용 MSW worker.
 *
 * main.tsx 에서 VITE_ENABLE_MSW === 'true' 일 때만 동적 import 후 start.
 * 프로덕션 번들에 포함되지 않도록 정적 import 금지(동적 import 전용).
 */
export const worker = setupWorker(...handlers);
