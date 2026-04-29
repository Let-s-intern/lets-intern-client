import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';
import { log } from '../support/log';

/** /login 페이지 Page Object. 이메일/비밀번호 입력 후 제출. */
export class LoginPage extends BasePage {
  async waitForLoaded(): Promise<this> {
    await this.page.waitForURL(/\/login/, { timeout: 15_000 });
    await this.settle();
    return this;
  }

  /**
   * 이메일/비밀번호 입력 후 로그인.
   * 로컬 환경에서 redirect 가 깨져 404 페이지가 노출되는 케이스가 있어
   * 404 감지 시 "홈페이지로 돌아가기" 클릭 또는 page.goto('/') 로 복구.
   *
   * extraMs: 로그인 완료 후 settle 대기시간 (spec 에서 조정 가능).
   */
  async loginWith(
    email: string,
    password: string,
    extraMs?: number,
  ): Promise<HomePage> {
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

    // 로그인 성공 시 /login 에서 벗어남 (정상 redirect 또는 404 페이지).
    await this.page.waitForURL(
      (url) => !/\/login(\?|$|\/)/.test(url.pathname),
      { timeout: 30_000 },
    );
    await this.settle(extraMs);

    // 404 감지 → 홈 복귀 fallback (로컬 환경 redirect 이슈 대비).
    if (await this.is404()) {
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      log('⚠️  404 PAGE DETECTED AFTER LOGIN');
      log(`   URL: ${this.page.url()}`);
      log(
        '   원인: 로그인 redirect 가 잘못된 경로로 보냄 (로컬 dev 환경에서 자주)',
      );
      log('   복구: "홈페이지로 돌아가기" 또는 page.goto("/")');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      await this.recoverFrom404();
    }

    return new HomePage(this.page);
  }

  /** 페이지에 404 / "찾을 수 없음" 표식이 있는지. */
  private async is404(): Promise<boolean> {
    return this.page
      .getByText(/404|페이지를?\s*찾을\s*수\s*없|not\s*found/i)
      .first()
      .isVisible({ timeout: 1_500 })
      .catch(() => false);
  }

  /** 404 페이지에서 홈으로 복귀. 버튼 있으면 클릭, 없으면 직접 이동. */
  private async recoverFrom404(): Promise<void> {
    const homeButton = this.page
      .getByRole('link', {
        name: /홈페이지\s*로\s*돌아가|홈으로|메인으로|home/i,
      })
      .or(
        this.page.getByRole('button', {
          name: /홈페이지\s*로\s*돌아가|홈으로|메인으로/i,
        }),
      )
      .first();
    if (await homeButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      log('  → "홈페이지로 돌아가기" 버튼 클릭');
      await homeButton.click();
    } else {
      log('  → 복귀 버튼 못 찾음 → page.goto("/") 로 직접 이동');
      await this.page.goto('/');
    }
    await this.settle();
  }
}
