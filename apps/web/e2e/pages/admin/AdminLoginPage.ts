import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ADMIN_URL } from '../../support/lc3492';

/**
 * 어드민 로그인. 어드민은 별도 앱(기본 :3001)이라 절대 주소로 연다.
 * 로그인 전에는 어느 경로든 `AdminGuard` 가 로그인 폼을 그린다.
 */
export class AdminLoginPage extends BasePage {
  async goto(path = '/'): Promise<this> {
    await this.page.goto(`${ADMIN_URL}${path}`);
    await this.settle();
    return this;
  }

  async loginWith(email: string, password: string): Promise<void> {
    await this.page.locator('#admin-email').fill(email);
    await this.page.locator('#admin-password').fill(password);
    await this.page.getByRole('button', { name: '로그인' }).click();
    // 로그인되면 폼이 사라지고 사이드바가 그려진다
    await expect(this.page.locator('#admin-email')).toBeHidden({
      timeout: 15_000,
    });
    await expect(
      this.page.getByRole('link', { name: '멘토 관리' }),
      '어드민 사이드바가 보여야 한다',
    ).toBeVisible({ timeout: 15_000 });
    await this.settle();
  }
}
