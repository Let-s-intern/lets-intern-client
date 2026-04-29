import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 결제 결과 Page Object.
 *   - /order/result 또는 /library 도착을 모두 수용
 *   - 성공 안내 텍스트 검증
 */
export class OrderResultPage extends BasePage {
  async waitForLoaded(extraMs?: number): Promise<this> {
    await this.page.waitForURL(/\/order\/result|\/library/, {
      timeout: 30_000,
    });
    await this.settle(extraMs);
    return this;
  }

  async expectSuccess(): Promise<this> {
    await expect(
      this.page
        .getByText(/결제\s*완료|주문\s*완료|신청\s*완료|성공/i)
        .or(this.page.getByText(/내\s*라이브러리|학습\s*시작/i))
        .first(),
      '결제 결과 또는 라이브러리 페이지에 성공 안내가 표시되어야 한다',
    ).toBeVisible({ timeout: 15_000 });
    return this;
  }
}
