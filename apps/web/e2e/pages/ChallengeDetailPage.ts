import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 챌린지 상세 페이지 (/program/challenge/[id]/[slug]) Page Object.
 *
 * 진입 후 가능한 상태:
 *   - 'available'  : "지금 바로 신청"/"신청하기" CTA 노출 → 신청 가능
 *   - 'closed'     : "출시알림신청" 노출 → 종료/시작 전
 *   - 'enrolled'   : "시작하기"/"내 라이브러리" 노출 → 이미 신청 완료
 *   - 'unknown'    : 위 셋 모두 감지 안 됨 (DOM 변경 등)
 */
export type ChallengeStatus = 'available' | 'closed' | 'enrolled' | 'unknown';

const APPLY_REGEX = /바로\s*신청|신청하기|구매하기|지금\s*신청/i;
const CLOSED_REGEX = /출시\s*알[림람]\s*신청|모집\s*마감/i;
const ENROLLED_REGEX = /시작하기|내\s*라이브러리|이미\s*신청|수강\s*중/i;

export class ChallengeDetailPage extends BasePage {
  /**
   * 상세 페이지 로드 대기.
   *   - URL: /program/challenge/[id]/[slug]
   *   - 제목 검증: 제공되면 검사, 없으면 skip (어떤 챌린지인지 모를 때)
   *   - settle(3000): BE fetch + React state 반영 충분히 대기 — default state
   *     (출시알림신청) 오감지 방지
   */
  async waitForLoaded(expectedTitleSubstring?: string): Promise<this> {
    await this.page.waitForURL(/\/program\/challenge\/[^/]+\/[^/]+/, {
      timeout: 15_000,
    });
    if (expectedTitleSubstring) {
      await expect(this.page).toHaveTitle(
        new RegExp(expectedTitleSubstring, 'i'),
        { timeout: 10_000 },
      );
    }
    await this.settle(3000);
    return this;
  }

  /**
   * 신청 가능성 검사. 우선순위:
   *   1) 신청 CTA 보임 → available
   *   2) 출시알림신청 보임 → closed
   *   3) 시작하기/라이브러리 보임 → enrolled
   *   4) unknown
   */
  async checkStatus(): Promise<ChallengeStatus> {
    const hasApply = await this.page
      .getByRole('button', { name: APPLY_REGEX })
      .or(this.page.getByRole('link', { name: APPLY_REGEX }))
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    if (hasApply) return 'available';

    const isClosed = await this.page
      .getByRole('button', { name: CLOSED_REGEX })
      .or(this.page.getByRole('link', { name: CLOSED_REGEX }))
      .or(this.page.getByText(CLOSED_REGEX))
      .first()
      .isVisible()
      .catch(() => false);
    if (isClosed) return 'closed';

    const isEnrolled = await this.page
      .getByRole('button', { name: ENROLLED_REGEX })
      .first()
      .isVisible()
      .catch(() => false);
    if (isEnrolled) return 'enrolled';

    return 'unknown';
  }

  /** 신청 CTA 버튼 클릭. checkStatus() === 'available' 일 때만 호출. */
  async clickApply(): Promise<void> {
    const button = this.page
      .getByRole('button', { name: APPLY_REGEX })
      .or(this.page.getByRole('link', { name: APPLY_REGEX }))
      .first();
    await expect(button, '신청 CTA 버튼이 보여야 한다').toBeVisible({
      timeout: 10_000,
    });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await this.settle();
  }
}
