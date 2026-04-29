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
  testDir: './e2e/specs',
  fullyParallel: true,
  // 단계가 많은 결제 시나리오 등은 30s 로 부족 → 120s 기본.
  // (단계별 wait + lazy load + 4-state 검사 누적 시간 흡수)
  timeout: 120_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  // globalSetup 은 한 번 실행되어 storageState.json 을 생성한다.
  // 환경변수가 비어 있으면 setup 은 noop 으로 통과한다.
  globalSetup: require.resolve('./e2e/support/global-setup.ts'),
  use: {
    baseURL,
    // 디버깅 산출물 — 단계별 스크린샷이 spec 안에서 page.screenshot() 으로
    // 명시적으로 찍히므로, 자동 비디오/스크린샷은 끔. trace 는 실패 시만 보존.
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'off',
    // 데스크톱 viewport 강제 — 기본값 1280x720 은 일부 사이트에서
    // 모바일 breakpoint 로 판정되어 햄버거 메뉴로 전환됨.
    // 렛츠커리어 헤더의 "프로그램" 드롭다운은 데스크톱 nav 에만 있으므로
    // 1920x1080 으로 확실한 데스크톱 레이아웃을 보장.
    viewport: { width: 1920, height: 1080 },
    // 모든 액션에 마진 — Next dev 컴파일이 느려도 안정적.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
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
  // webServer 자동 spawn 은 의도적으로 사용하지 않는다.
  // 운영 흐름:
  //   - 로컬: 사용자가 `pnpm --filter web dev` 를 별도 터미널에서 띄워두고 실행
  //   - staging 검증: PLAYWRIGHT_BASE_URL 을 staging 으로 가리켜서 dev 서버 불요
  //   - CI: 워크플로 step 으로 dev 또는 빌드된 web 을 먼저 띄운 뒤 e2e 실행
  // 자동 spawn 시 reuseExistingServer 판단이 실패해 EADDRINUSE 가 자주 발생했음.
  // baseURL 이 응답 안 하면 첫 page.goto 에서 ERR_CONNECTION_REFUSED 로 즉시 fail 하므로
  // 진단 비용도 낮다.
});
