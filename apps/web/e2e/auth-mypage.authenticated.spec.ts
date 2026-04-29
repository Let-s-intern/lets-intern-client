import { test, expect } from '@playwright/test';

/**
 * 시나리오 2 (로그인): 마이페이지 진입 + SSO 해시 회귀 방지.
 *
 * storageState (e2e/.auth/storageState.json) 를 사용해 로그인 단계 없이 인증 상태 재사용.
 * E2E_TEST_USER_EMAIL/PW 가 비어 있으면 globalSetup 이 빈 storageState 를 만들므로,
 * 이 시나리오는 실제로 인증되지 않은 상태로 진입하게 된다 — 따라서 자동 skip.
 */

const hasCredentials = Boolean(
  process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PW,
);

test.describe('mypage (authenticated)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );

  test('마이페이지가 인증 상태로 200 응답을 준다', async ({ page }) => {
    const response = await page.goto('/mypage');
    expect(response?.status(), 'HTTP 상태가 200/3xx 여야 한다').toBeLessThan(
      400,
    );

    // TODO: 인증 후에만 노출되는 마이페이지 컴포넌트 selector (예: 닉네임/이메일) 보강.
    expect(page.url()).toContain('/mypage');
  });
});

test.describe('SSO hash regression', () => {
  const ssoHash = process.env.E2E_SSO_TEST_HASH ?? '';

  test.skip(
    !ssoHash,
    'E2E_SSO_TEST_HASH 가 비어 있어 SSO 해시 회귀 시나리오를 skip 합니다.',
  );

  test('SSO 해시 진입 시 인증 상태로 라우팅된다', async ({ page, context }) => {
    // SSO 시나리오에서는 인증 storageState 를 명시적으로 비워야 정확한 회귀 검증이 가능.
    // 하지만 현재 project 가 storageState 를 강제하므로, 새 context 에서 검증.
    await context.clearCookies();

    const response = await page.goto(`/?token=${ssoHash}`);
    expect(response?.status()).toBeLessThan(400);

    // TODO: 실제 SSO 해시 처리 후 어디로 라우팅 되는지 staging 동작에 맞춰 보강.
    // 최근 커밋 (d56ffb19a, 67a2964d8) 에서 init 플래그 처리가 변경됐음 — 그 회귀를 잡는 게 목적.
  });
});
