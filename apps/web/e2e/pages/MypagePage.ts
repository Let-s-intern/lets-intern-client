import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForAnchor } from '../support/settle';
import { log } from '../support/log';

/**
 * 마이페이지 (/mypage) Page Object.
 *
 * 결제 완료 후 신청한 프로그램이 사용자 보관함에 정상 추가되었는지 검증.
 */
export class MypagePage extends BasePage {
  async goto(extraMs?: number): Promise<this> {
    await this.page.goto('/mypage');
    await this.waitForLoaded(extraMs);
    return this;
  }

  /** /mypage 도달 + 마이페이지 anchor 노출 대기. */
  async waitForLoaded(extraMs?: number): Promise<this> {
    await this.page.waitForURL(/\/mypage/, { timeout: 15_000 });
    // 마이페이지 anchor — 페이지 헤더/네비/콘텐츠 어느 쪽이든 visible 시 진행.
    const anchorAppeared = await waitForAnchor(
      this.page,
      [
        'text=/마이\\s*페이지/',
        'text=/내\\s*프로그램|신청\\s*프로그램|학습\\s*중|보관함/',
        'a[href*="/mypage"]',
      ],
      15_000,
    );
    if (!anchorAppeared) {
      log('    [MypagePage] 마이페이지 anchor 미감지 — 페이지 구조 확인 필요');
    }
    if (extraMs && extraMs > 0) await this.settle(extraMs);
    return this;
  }

  /**
   * 마이페이지에 신청 프로그램이 보이는지 검증.
   * programTitle 제공 시 그 텍스트 매칭, 미제공 시 일반 신청 안내 텍스트 매칭.
   */
  async expectHasProgram(programTitle?: string): Promise<this> {
    if (programTitle) {
      await expect(
        this.page.getByText(new RegExp(programTitle, 'i')).first(),
        `마이페이지에 "${programTitle}" 프로그램이 보여야 한다`,
      ).toBeVisible({ timeout: 15_000 });
    } else {
      // 제목 모를 때 — 마이페이지에 신청/학습 관련 콘텐츠가 노출되는지만 확인.
      await expect(
        this.page.getByText(/신청|학습|진행|수강|이수|보관함|챌린지/i).first(),
        '마이페이지에 신청/학습 관련 안내가 표시되어야 한다',
      ).toBeVisible({ timeout: 15_000 });
    }
    return this;
  }
}
