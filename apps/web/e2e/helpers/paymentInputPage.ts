import { type Page, expect } from '@playwright/test';

/**
 * 결제 입력 페이지(/payment-input) Page Object.
 *
 * 실제 selector 는 staging UI 에 맞춰 codegen / e2e:ui 모드로 보강 필요.
 */
export class PaymentInputPage {
  constructor(private readonly page: Page) {}

  /**
   * 결제 입력 페이지 진입 대기.
   * SPA 라우팅이라 URL 매칭 + 폼 노출 둘 다 확인.
   */
  async waitForLoaded() {
    await this.page.waitForURL(/\/payment-input/, { timeout: 30_000 });
    // TODO: 페이지의 안정적 anchor (예: 제목/주문자정보 섹션 헤더) selector 로 교체.
    await expect(
      this.page.getByText(/주문자|결제|결제\s*정보/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  /**
   * 주문자 정보 입력.
   * label/placeholder 우선으로 잡되, 환경에 따라 보강 필요.
   */
  async fillPurchaser(opts: { name: string; phone: string; email: string }) {
    // TODO: 실제 input 라벨/이름과 일치하도록 교체.
    const nameInput = this.page
      .getByLabel(/이름|성함|주문자\s*명/i)
      .or(this.page.getByPlaceholder(/이름|성함/i))
      .first();
    if (await nameInput.count()) {
      await nameInput.fill(opts.name);
    }

    const phoneInput = this.page
      .getByLabel(/전화|휴대폰|연락처/i)
      .or(this.page.getByPlaceholder(/전화|휴대폰|010/i))
      .first();
    if (await phoneInput.count()) {
      await phoneInput.fill(opts.phone);
    }

    const emailInput = this.page
      .getByLabel(/이메일|email/i)
      .or(this.page.getByPlaceholder(/이메일|email|@/i))
      .first();
    if (await emailInput.count()) {
      await emailInput.fill(opts.email);
    }
  }

  /**
   * 필수 약관 일괄 동의.
   * "전체 동의" 가 있으면 그것을, 없으면 필수 항목 개별 체크.
   */
  async acceptRequiredAgreements() {
    // TODO: 약관 영역의 정확한 selector 로 교체.
    const agreeAll = this.page
      .getByRole('checkbox', { name: /전체\s*동의/i })
      .first();
    if (await agreeAll.count()) {
      await agreeAll.check();
      return;
    }
    // fallback: 필수 표시가 있는 체크박스를 모두 체크
    const requiredBoxes = this.page.getByRole('checkbox', {
      name: /필수|이용약관|개인정보/i,
    });
    const count = await requiredBoxes.count();
    for (let i = 0; i < count; i += 1) {
      const box = requiredBoxes.nth(i);
      if (!(await box.isChecked())) {
        await box.check();
      }
    }
  }

  /**
   * 결제 버튼이 활성 상태로 노출되는지 확인.
   * 무료 옵션 시나리오는 클릭까지 진행하지만, 디버그 시 활성 확인 후 STOP 도 가능.
   */
  async expectPayButtonEnabled() {
    const payButton = this.payButton();
    await expect(payButton, '결제 버튼이 활성화되어야 한다').toBeEnabled({
      timeout: 10_000,
    });
  }

  /**
   * 결제 버튼 클릭. 무료 옵션이 BE 측에서 PG 우회 처리되면
   * 즉시 /order/result 로 이동, PG 거치는 분기라면 외부 페이지 한 단계 끼어듦.
   */
  async clickPay() {
    await this.payButton().click();
  }

  private payButton() {
    // TODO: 결제 버튼의 정확한 selector 로 교체. 라벨 변형 다양해 정규식 매칭.
    return this.page
      .getByRole('button', { name: /결제하기|결제\s*진행|신청하기|완료/i })
      .first();
  }
}
