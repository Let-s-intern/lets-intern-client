import type { Page } from '@playwright/test';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../support/lc3492';

/**
 * 어드민 로그인 흐름 — `http://localhost:3001` 로그인 폼에 로컬 어드민 계정을 넣는다.
 * 토큰은 어드민 출처(origin)에만 남는다. 웹 화면은 비로그인으로 본다.
 */
export async function adminLoginFlow(
  page: Page,
  options: { email?: string; password?: string } = {},
): Promise<void> {
  const login = await new AdminLoginPage(page).goto();
  await login.loginWith(
    options.email ?? ADMIN_EMAIL,
    options.password ?? ADMIN_PASSWORD,
  );
}
