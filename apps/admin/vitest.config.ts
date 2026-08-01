import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // `.env` 는 저장소에 커밋하지 않으므로 테스트가 참조하는 값만 여기서 고정한다.
    // `@/utils/axios` 는 baseURL 이 비면 모듈 로드 시점에 throw 한다.
    env: {
      VITE_SERVER_API: 'http://localhost/api/v1',
      VITE_SERVER_API_V2: 'http://localhost/api/v2',
      VITE_WEB_URL: 'http://localhost:3000',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
