import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ChallengeDetailPage } from './ChallengeDetailPage';
import { log } from '../support/log';

/**
 * /program 전체 프로그램 목록 Page Object.
 *
 * 카드 DOM (실제 ProgramCard.tsx 기준):
 *   <div onClick={...} className="program_card ..." data-program-text="...">
 *
 * 즉 카드는 <a> 가 아니라 onClick 으로 router.push 하는 <div>.
 * selector 는 .program_card[data-program-text] 로 매칭.
 *
 * 카드에는 type(challenge/live/guidebook/vod) 표식이 없으므로,
 * 클릭 후 URL 로 challenge 인지 검증.
 */
export class ProgramListPage extends BasePage {
  /** /program 으로 이동 후 settle. */
  async goto(extraMs?: number): Promise<this> {
    await this.page.goto('/program');
    await this.settle(extraMs);
    return this;
  }

  /** 모든 프로그램 카드 (type 무관). */
  private programCards() {
    return this.page.locator('.program_card[data-program-text]');
  }

  /**
   * 현재 페이지의 프로그램 카드 개수 (challenge/live/guidebook/vod 통합).
   * 첫 카드 visible 까지 명시 대기 + lazy-load 스크롤.
   */
  async getProgramCount(): Promise<number> {
    const cards = this.programCards();
    log('  -> 첫 프로그램 카드 가시화 대기 (최대 15초)');
    const firstAppeared = await cards
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (!firstAppeared) {
      const allDivs = await this.page
        .locator('[class*="program_card"]')
        .count();
      const bodyTextSample = (
        await this.page
          .locator('body')
          .innerText()
          .catch(() => '')
      ).slice(0, 200);
      log(
        `  [WARN] 프로그램 카드를 찾지 못했습니다.\n` +
          `    .program_card 매칭 수: ${allDivs}\n` +
          `    페이지 본문 샘플(200자): ${JSON.stringify(bodyTextSample)}`,
      );
    }

    await this.scrollToBottomOnce();
    const count = await cards.count();
    log(`  -> 프로그램 카드 카운트: ${count}개`);
    return count;
  }

  /**
   * N 번째 프로그램 카드 클릭 -> 라우트 이동.
   * 챌린지 카드면 ChallengeDetailPage 반환, 아니면 null (spec 에서 다음으로 시도).
   */
  async openProgramByIndex(
    index: number,
    extraMs?: number,
  ): Promise<ChallengeDetailPage | null> {
    const cards = this.programCards();
    const total = await cards.count();
    if (index >= total) {
      throw new Error(
        `목록에 ${index + 1}번째 카드가 없습니다 (총 ${total}개).`,
      );
    }

    const card = cards.nth(index);
    const cardTitle = await card
      .getAttribute('data-program-text')
      .catch(() => null);
    log(`  -> ${index + 1}번째 카드 클릭: "${cardTitle ?? '(제목 미상)'}"`);

    await expect(
      card,
      `${index + 1}번째 프로그램 카드가 보여야 한다`,
    ).toBeVisible({ timeout: 10_000 });
    await card.scrollIntoViewIfNeeded();
    await card.click();

    // 모든 프로그램 type 의 detail URL 패턴.
    await this.page
      .waitForURL(/\/program\/(challenge|live|guidebook|vod)\//, {
        timeout: 15_000,
      })
      .catch(() => undefined);

    const url = this.page.url();
    if (!/\/program\/challenge\//.test(url)) {
      log(`  [WARN] 챌린지 아닌 프로그램 진입 (url=${url}) -> 다음 카드 시도`);
      return null;
    }

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
