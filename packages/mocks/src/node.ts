import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Node 환경용 MSW 서버 (테스트/SSR).
 * vitest setupFiles에서 `server.listen()` / `server.close()` 호출.
 */
export const server = setupServer(...handlers);
