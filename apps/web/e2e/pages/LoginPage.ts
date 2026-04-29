import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';

/** /login 페이지 Page Object. 이메일/비밀번호 입력 후 제출. */
export class LoginPage extends BasePage {
  async waitForLoaded(): Promise<this> {
    await this.page.waitForURL(/\/login/, { timeout: 15_000 });
    await this.settle();
    return this;
  }

  /** 이메일/비밀번호 입력 후 로그인 → 로그인 후 라우트로 이동. */
  async loginWith(email: string, password: string): Promise<HomePage> {
    const emailInput = this.page
      .getByLabel(/이메일|email/i)
      .or(this.page.getByPlaceholder(/이메일|email|@/i))
      .first();
    await expect(emailInput, '이메일 입력 필드가 보여야 한다').toBeVisible({
      timeout: 10_000,
    });
    await emailInput.fill(email);

    const passwordInput = this.page
      .getByLabel(/비밀번호|password/i)
      .or(this.page.getByPlaceholder(/비밀번호|password/i))
      .first();
    await expect(passwordInput, '비밀번호 입력 필드가 보여야 한다').toBeVisible(
      { timeout: 5_000 },
    );
    await passwordInput.fill(password);

    const submit = this.page
      .getByRole('button', { name: /^로그인$|로그인하기/ })
      .first();
    await submit.click();

    // 로그인 성공 시 /login 에서 벗어남.
    await this.page.waitForURL(
      (url) => !/\/login(\?|$|\/)/.test(url.pathname),
      { timeout: 30_000 },
    );
    await this.settle();
    return new HomePage(this.page);
  }
}
