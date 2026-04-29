import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'node:path';

// .env.test.local 우선, 없으면 .env.local 의 값을 사용.
// .env.test.local 의 값이 비어 있으면 globalSetup 이 자동 skip 된다.
dotenv.config({ path: path.resolve(__dirname, '.env.test.local') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  process.env.E2E_BASE_URL ??
  'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  // globalSetup 은 한 번 실행되어 storageState.json 을 생성한다.
  // 환경변수가 비어 있으면 setup 은 noop 으로 통과한다.
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // 비로그인 시나리오 — storageState 미사용
    {
      name: 'chromium-anonymous',
      use: { browserName: 'chromium' },
      testMatch: /.*\.anonymous\.spec\.ts/,
    },
    // 로그인 시나리오 — globalSetup 이 만든 storageState 재사용
    {
      name: 'chromium-authenticated',
      use: {
        browserName: 'chromium',
        storageState: 'e2e/.auth/storageState.json',
      },
      testMatch: /.*\.authenticated\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
