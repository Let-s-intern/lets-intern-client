import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

const mentorIdOf = (href: string | null) =>
  Number(href?.match(/\/mentors\/(\d+)/)?.[1]);

/** 웹 멘토 목록 (/mentors). 렛커 픽 라벨(LC-3500), 키워드 필터(LC-3501), 대표 경력 표시(LC-3497) */
export class MentorListPage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto('/mentors', { waitUntil: 'domcontentloaded' });
    await expect(this.cards.first()).toBeVisible({ timeout: 30_000 });
    await this.settle();
    return this;
  }

  get cards(): Locator {
    return this.page.locator('a[href^="/mentors/"]');
  }

  card(mentorId: number): Locator {
    return this.page.locator(`a[href="/mentors/${mentorId}"]`);
  }

  /** 1페이지 카드의 멘토 id (화면 순서) */
  async mentorIds(): Promise<number[]> {
    const hrefs = await this.cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    return hrefs.map(mentorIdOf);
  }

  /** 「렛커 픽」 라벨이 붙은 카드의 멘토 id */
  async pickedMentorIds(): Promise<number[]> {
    const hrefs = await this.cards
      .filter({ hasText: '렛커 픽' })
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    return hrefs.map(mentorIdOf);
  }

  /** 키워드 칩으로 거른다. 데스크톱·모바일 칩이 함께 있어 보이는 것을 누른다 */
  async filterByKeyword(title: string): Promise<void> {
    await this.page
      .getByRole('button', { name: title, exact: true })
      .filter({ visible: true })
      .first()
      .click();
    await this.settle();
  }
}
