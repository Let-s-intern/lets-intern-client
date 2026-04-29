import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ChallengeDetailPage } from './ChallengeDetailPage';

/** /program 전체 프로그램 목록 Page Object. */
export class ProgramListPage extends BasePage {
  /**
   * 제목으로 챌린지를 찾아 클릭 → 챌린지 상세로 이동.
   * 첫 화면에 없으면 페이지 끝까지 스크롤로 lazy load 트리거.
   */
  async openChallengeByTitle(title: string): Promise<ChallengeDetailPage> {
    const card = this.page
      .getByRole('link', { name: new RegExp(title, 'i') })
      .or(this.page.locator(`a:has-text("${title}")`))
      .or(this.page.getByText(new RegExp(title, 'i')))
      .first();

    if (!(await card.isVisible().catch(() => false))) {
      for (let i = 0; i < 10; i += 1) {
        await this.page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );
        await this.page.waitForTimeout(500);
        if (await card.isVisible().catch(() => false)) break;
      }
    }

    await expect(
      card,
      `전체 프로그램 목록에 "${title}" 챌린지가 보여야 한다.\n` +
        '확인할 것: admin 노출 상태, 제목 표시 형식, 03-전체프로그램_목록.png',
    ).toBeVisible({ timeout: 15_000 });

    await card.scrollIntoViewIfNeeded();
    await card.click();

    const detail = new ChallengeDetailPage(this.page);
    await detail.waitForLoaded(title);
    return detail;
  }
}
