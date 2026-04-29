import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ChallengeDetailPage } from './ChallengeDetailPage';
import { log } from '../support/log';

/** /program 전체 프로그램 목록 Page Object. */
export class ProgramListPage extends BasePage {
  /** /program 으로 이동 후 settle. 이미 그 페이지에 있으면 새로고침 효과. */
  async goto(extraMs?: number): Promise<this> {
    await this.page.goto('/program');
    await this.settle(extraMs);
    return this;
  }

  /**
   * 챌린지 카드 링크 locator.
   *   ProgramCard.tsx 의 href = `/program/${type}/${id}` (type='challenge').
   *   - /program/challenge/{id} 패턴 매칭
   *   - 같은 카드에 thumbnail + title 두 개 link 가 있을 수 있어 dedupe 위해
   *     href 에 숫자 id 가 끝에 오는 것만 카운트
   */
  private challengeLinks() {
    return this.page.locator('a[href^="/program/challenge/"]');
  }

  /**
   * 현재 페이지의 챌린지 카드 개수.
   *   - 첫 카드가 visible 될 때까지 최대 15s 대기 (BE fetch + hydration)
   *   - 그 후 lazy-load 트리거를 위한 1회 스크롤 다운
   *   - 카드 0건이면 진단 로그 + 페이지 텍스트 일부 출력
   */
  async getChallengeCount(): Promise<number> {
    const links = this.challengeLinks();
    log('  → 첫 챌린지 카드 가시화 대기 (최대 15초)');
    const firstAppeared = await links
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (!firstAppeared) {
      // 진단: 페이지에 어떤 link 가 있는지, 텍스트 일부
      const allProgramLinks = await this.page
        .locator('a[href^="/program/"]')
        .count();
      const bodyTextSample = (
        await this.page
          .locator('body')
          .innerText()
          .catch(() => '')
      ).slice(0, 200);
      log(
        `  ⚠ 챌린지 카드를 찾지 못했습니다.\n` +
          `    /program/* 으로 시작하는 모든 링크 개수: ${allProgramLinks}\n` +
          `    페이지 본문 샘플(200자): ${JSON.stringify(bodyTextSample)}`,
      );
    }

    await this.scrollToBottomOnce();
    const count = await links.count();
    log(`  → 챌린지 카드 카운트: ${count}개`);
    return count;
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
