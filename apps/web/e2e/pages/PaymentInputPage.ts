import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderResultPage } from './OrderResultPage';

/**
 * 결제 입력/모달 Page Object.
 *
 * "지금 바로 신청" 클릭 후의 화면을 다룬다. 챌린지에 따라:
 *   - 모달 단계 ("신청하기") 가 한 번 더 끼는 케이스
 *   - 바로 "0원 결제하기" 가 보이는 케이스
 * 둘 다 적응형으로 처리.
 */
export class PaymentInputPage extends BasePage {
  /** 모달의 "신청하기" 가 보이면 한 번 더 클릭. 없으면 noop. */
  async clickEnrollIfPresent(): Promise<this> {
    const modalEnroll = this.page
      .getByRole('button', { name: /^신청하기$/ })
      .first();
    if (await modalEnroll.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await modalEnroll.click();
      await this.settle();
    }
    return this;
  }

  /**
   * "0원 결제하기" 버튼 클릭 → 결과 페이지로 이동.
   * 라벨이 가격 안전 가드 역할 (유료라면 "N,000원 결제하기" 로 매칭 실패).
   */
  async clickPayZero(): Promise<OrderResultPage> {
    const payZero = this.page
      .getByRole('button', { name: /0\s*원\s*결제/i })
      .first();
    await expect(
      payZero,
      '"0원 결제하기" 버튼이 보여야 한다 (안전 가드: 무료 옵션 확인)',
    ).toBeVisible({ timeout: 10_000 });
    await payZero.click();

    const next = new OrderResultPage(this.page);
    await next.waitForLoaded();
    return next;
  }
}
