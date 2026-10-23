import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/** 웹 1:1 라이브 멘토링 목록 (/live-mentoring). 렛커 픽 정렬·라벨(LC-3500) */
export class LiveMentoringListPage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto('/live-mentoring', {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.cards.first()).toBeVisible({ timeout: 30_000 });
    await this.settle();
    return this;
  }

  get cards(): Locator {
    return this.page.locator('a[href^="/live-mentoring/"]').filter({
      has: this.page.locator('h2'),
    });
  }

  /** 1페이지 카드의 멘토 id (화면 순서) */
  async mentorIds(): Promise<number[]> {
    const hrefs = await this.cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    return hrefs.map((href) =>
      Number(href?.match(/\/live-mentoring\/(\d+)/)?.[1]),
    );
  }

  async pickedCount(): Promise<number> {
    return this.cards.filter({ hasText: '렛커 픽' }).count();
  }
}
