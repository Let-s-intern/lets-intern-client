import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 웹 1:1 상세 (/live-mentoring/:mentorId). 핵심 소개(LC-3496), 자유 입력란 배치(LC-3494·3495),
 * 「멘토님의 한마디」(LC-3501), 경력 로고(LC-3499), 후기 「추천순」(LC-3502)
 */
export class LiveMentoringDetailPage extends BasePage {
  async goto(mentorId: number): Promise<this> {
    await this.page.goto(`/live-mentoring/${mentorId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.page.getByText(/멘토가 함께해요$/).first()).toBeVisible({
      timeout: 30_000,
    });
    await this.settle();
    return this;
  }

  /** 자유 입력란 섹션. 위치에 맞는 슬롯 하나만 그려진다 */
  freeContent(): Locator {
    return this.page.locator('[data-free-content]');
  }

  /** 섹션 제목 텍스트(첫 번째)가 화면에서 a 다음에 b 가 오는지 */
  async isBefore(a: Locator, b: Locator): Promise<boolean> {
    return a.evaluate(
      (first, second) =>
        Boolean(
          first.compareDocumentPosition(second as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      await b.elementHandle(),
    );
  }

  oneLinerBox(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(/멘토님의 한마디$/) })
      .last();
  }

  /** 멘토 소개의 경력 줄 */
  careerLine(text: string): Locator {
    return this.page.locator('li').filter({ hasText: text }).first();
  }

  /** 후기 본문(지금 정렬 순서, 처음 보이는 몇 개) */
  async reviewTexts(): Promise<string[]> {
    return this.page
      .locator('#live-mentoring-review li p.whitespace-pre-line')
      .allInnerTexts();
  }
}
