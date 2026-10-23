import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 웹 멘토 프로필 (/mentors/:mentorId). 한줄소개·소개 본문(LC-3501), 경력 로고(LC-3499),
 * 후기 「추천순」(LC-3502), 세미나·VOD(LC-3503)
 */
export class MentorProfilePage extends BasePage {
  async goto(mentorId: number): Promise<this> {
    await this.page.goto(`/mentors/${mentorId}`);
    await expect(this.page.getByRole('heading', { level: 1 })).toBeVisible({
      timeout: 30_000,
    });
    await this.settle();
    return this;
  }

  /** 히어로의 「대표 회사 | 대표 직무」 줄 */
  heroAffiliation(): Locator {
    return this.page.locator('h1 + p');
  }

  /** 경력 줄. 줄 앞 아이콘 img 로 로고를 확인한다 */
  careerRow(company: string): Locator {
    return this.page
      .locator('div.flex.items-center')
      .filter({ has: this.page.getByText(new RegExp(`^${company} \\|`)) })
      .last();
  }

  introSection(): Locator {
    return this.page.locator('section').filter({
      has: this.page.getByRole('heading', { name: '멘토 소개' }),
    });
  }

  /** 후기 본문(지금 정렬 순서) */
  async reviewTexts(): Promise<string[]> {
    return this.page
      .locator('#mentor-reviews ul > li p.whitespace-pre-line')
      .allInnerTexts();
  }

  /** 「모집 중인 프로그램」, 「진행했던 프로그램」 영역 */
  programSection(title: string): Locator {
    return this.page
      .locator('div.flex.w-full.flex-col')
      .filter({ has: this.page.getByText(title, { exact: true }) })
      .last();
  }
}
