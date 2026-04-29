import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ChallengeDetailPage } from './ChallengeDetailPage';

/** /program 전체 프로그램 목록 Page Object. */
export class ProgramListPage extends BasePage {
  /** /program 으로 이동 후 settle. 이미 그 페이지에 있으면 새로고침 효과. */
  async goto(extraMs?: number): Promise<this> {
    await this.page.goto('/program');
    await this.settle(extraMs);
    return this;
  }

  /** 챌린지 카드 링크 locator (href 가 /program/challenge/ 로 시작). */
  private challengeLinks() {
    return this.page.locator('a[href*="/program/challenge/"]');
  }

  /** 현재 페이지의 챌린지 카드 개수. */
  async getChallengeCount(): Promise<number> {
    // lazy load 가능성 — 한 번 끝까지 스크롤해 노출시킨 뒤 카운트.
    await this.scrollToBottomOnce();
    return this.challengeLinks().count();
  }

  /** N 번째 챌린지 카드 클릭 → 상세 페이지로 이동. */
  async openChallengeByIndex(
    index: number,
    extraMs?: number,
  ): Promise<ChallengeDetailPage> {
    const links = this.challengeLinks();
    const total = await links.count();
    if (index >= total) {
      throw new Error(
        `목록에 ${index + 1}번째 챌린지가 없습니다 (총 ${total}개).`,
      );
    }
    const card = links.nth(index);
    await expect(
      card,
      `${index + 1}번째 챌린지 카드가 보여야 한다`,
    ).toBeVisible({ timeout: 10_000 });
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const detail = new ChallengeDetailPage(this.page);
    await detail.waitForLoaded(undefined, extraMs);
    return detail;
  }

  /** 한 번 페이지 끝까지 스크롤 — lazy load 트리거. */
  private async scrollToBottomOnce() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
    await this.page.waitForTimeout(800);
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(200);
  }
}
