import { chromium, type FullConfig } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Playwright globalSetup — storageState 생성기.
 *
 * 동작:
 *   1) E2E_TEST_USER_EMAIL / E2E_TEST_USER_PW 가 모두 채워져 있으면
 *      실제 로그인 후 e2e/.auth/storageState.json 에 저장.
 *   2) 그 외 경우(스켈레톤/CI without secret) 는 빈 storageState 만 만들어 둔다.
 *      이 경우 *.authenticated.spec.ts 는 test.skip() 으로 우회되어야 한다.
 *
 * 실제 selector / 로그인 폼 흐름은 staging 의 인증 UI 에 맞춰
 * **사용자가 채워야 하는 TODO** 로 남겨둔다.
 */

const AUTH_DIR = path.resolve(__dirname, '.auth');
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'storageState.json');

function ensureAuthDir() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

function writeEmptyStorageState() {
  ensureAuthDir();
  // Playwright 가 require 하는 최소 형태.
  fs.writeFileSync(
    STORAGE_STATE_PATH,
    JSON.stringify({ cookies: [], origins: [] }, null, 2),
  );
}

async function loginAndPersist(
  baseURL: string,
  email: string,
  password: string,
) {
  ensureAuthDir();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // TODO: staging 인증 페이지 URL/selector 에 맞춰 사용자 보강.
    // 아래는 패턴 스켈레톤. 실제 동작은 환경에 따라 조정 필요.
    await page.goto(`${baseURL}/login`);
    await page.getByLabel(/이메일|email/i).fill(email);
    await page.getByLabel(/비밀번호|password/i).fill(password);
    await page.getByRole('button', { name: /로그인|login/i }).click();

    // 로그인 완료 신호 — 마이페이지/홈 등 인증 후 라우팅 대기.
    await page.waitForURL((url) => !/\/login(\?|$)/.test(url.pathname), {
      timeout: 30_000,
    });

    await context.storageState({ path: STORAGE_STATE_PATH });
  } finally {
    await browser.close();
  }
}

export default async function globalSetup(config: FullConfig) {
  const baseURL =
    process.env.PLAYWRIGHT_BASE_URL ??
    process.env.E2E_BASE_URL ??
    config.projects[0]?.use.baseURL ??
    'http://localhost:3000';

  const email = process.env.E2E_TEST_USER_EMAIL ?? '';
  const password = process.env.E2E_TEST_USER_PW ?? '';

  if (!email || !password) {
    // 자격 증명이 없으면 빈 storageState 만 만들고 통과.
    writeEmptyStorageState();
    // eslint-disable-next-line no-console
    console.warn(
      '[playwright globalSetup] E2E_TEST_USER_EMAIL/PW 가 비어 있어 ' +
        '인증 storageState 생성을 skip 합니다. ' +
        '*.authenticated.spec.ts 는 test.skip() 으로 우회되어야 합니다.',
    );
    return;
  }

  try {
    await loginAndPersist(baseURL, email, password);
  } catch (error) {
    writeEmptyStorageState();
    // eslint-disable-next-line no-console
    console.error(
      '[playwright globalSetup] 로그인 실패. 빈 storageState 로 fallback 합니다.',
      error,
    );
  }
}
