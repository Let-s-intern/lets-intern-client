import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ADMIN_URL } from '../../support/lc3492';

/** 어드민 렛커 픽 (/mentors/pick, LC-3500). 순위 조작은 공통 RankControl(LC-3493) */
export class AdminMentorPickPage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto(`${ADMIN_URL}/mentors/pick`);
    await expect(
      this.page.getByRole('heading', { name: '렛커 픽' }),
    ).toBeVisible({ timeout: 15_000 });
    await this.settle();
    return this;
  }

  private get rows(): Locator {
    return this.page.locator('tbody tr');
  }

  /** 지금 화면 순서의 멘토 이름(두 번째 칸) */
  async names(): Promise<string[]> {
    return this.rows.locator('td:nth-child(2)').allInnerTexts();
  }

  rankInput(index: number): Locator {
    return this.page.getByLabel('노출 순위').nth(index);
  }

  upButton(index: number): Locator {
    return this.page.getByLabel('위로 이동').nth(index);
  }

  downButton(index: number): Locator {
    return this.page.getByLabel('아래로 이동').nth(index);
  }

  /** 순위 칸에 값을 넣고 Enter 로 반영한다 */
  async enterRank(index: number, value: string): Promise<void> {
    const input = this.rankInput(index);
    await input.fill(value);
    await input.press('Enter');
  }

  async saveOrder(): Promise<void> {
    const saved = this.page.waitForResponse(
      (res) =>
        res.url().includes('/admin/mentor/pick') &&
        res.request().method() === 'PUT',
    );
    await this.page.getByRole('button', { name: '순서 저장' }).click();
    expect((await saved).ok(), '픽 저장 응답이 성공이어야 한다').toBe(true);
    await this.settle();
  }
}
