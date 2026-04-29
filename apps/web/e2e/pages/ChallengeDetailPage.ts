import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from '../support/log';
import { waitForAnchor } from '../support/settle';

/**
 * 챌린지 상세 페이지 (/program/challenge/[id]/[slug]) Page Object.
 *
 * 진입 후 가능한 상태:
 *   - 'available'  : 메인 CTA 의 "신청하기"/"지금 바로 신청" 노출 → 신청 가능
 *   - 'closed'     : 메인 CTA 의 "출시알림신청" 노출 → 종료/시작 전
 *   - 'enrolled'   : "시작하기"/"내 라이브러리" 노출 → 이미 신청 완료
 *   - 'unknown'    : 위 셋 모두 감지 안 됨 (DOM 변경 등)
 *
 * 스코프 전략:
 *   소스 (OverviewContent.tsx) 기준 메인 CTA 는 className 으로 식별:
 *     - 신청 가능: <button class="apply_button ...">신청하기 / 신청 완료</button>
 *     - 종료/시작전: <NotiButton className="early_button">출시알림신청</...>
 *   추천 섹션 등 페이지 다른 위치의 같은 텍스트와 충돌 방지하기 위해
 *   className-scope 우선, 라벨 regex 는 fallback.
 */
export type ChallengeStatus = 'available' | 'closed' | 'enrolled' | 'unknown';

const APPLY_REGEX = /바로\s*신청|신청하기|구매하기|지금\s*신청/i;
const CLOSED_REGEX = /출시\s*알[림람]\s*신청|모집\s*마감/i;
const ENROLLED_REGEX = /시작하기|내\s*라이브러리|이미\s*신청|수강\s*중/i;

export class ChallengeDetailPage extends BasePage {
  /**
   * 상세 페이지 로드 대기 (동적).
   *   - URL: /program/challenge/[id]/[slug] redirect 완료 대기
   *   - 제목 검증: 제공되면 검사
   *   - 메인 CTA anchor (.apply_button / .early_button / "시작하기")
   *     중 하나가 visible 될 때까지 동적 대기 — 정적 wait 미사용
   *
   * extraMs 는 anchor 가 떴어도 추가로 더 기다릴 양 (기본 0 — 떴으면 즉시 진행).
   */
  async waitForLoaded(
    expectedTitleSubstring?: string,
    extraMs = 0,
  ): Promise<this> {
    await this.page.waitForURL(/\/program\/challenge\/[^/]+\/[^/]+/, {
      timeout: 15_000,
    });
    if (expectedTitleSubstring) {
      await expect(this.page).toHaveTitle(
        new RegExp(expectedTitleSubstring, 'i'),
        { timeout: 10_000 },
      );
    }

    // 메인 CTA 가 노출될 때까지 동적 대기.
    // .apply_button (가용) / .early_button (종료) / 시작하기/이미신청 anchor 중 하나.
    const anchorAppeared = await waitForAnchor(
      this.page,
      [
        'button.apply_button',
        '.early_button',
        // enrolled 상태도 포함 — 이미 신청한 사용자에게 보이는 라벨
        'button:has-text("시작하기")',
        'button:has-text("내 라이브러리")',
        'button:has-text("이미 신청")',
      ],
      15_000,
    );
    if (!anchorAppeared) {
      log(
        '    [waitForLoaded] 메인 CTA anchor 미감지 — checkStatus 가 unknown 처리할 것.',
      );
    }

    if (extraMs > 0) await this.settle(extraMs);
    return this;
  }

  /**
   * 신청 가능성 검사. className-scope 우선, label regex fallback.
   *
   * 우선순위:
   *   1) .apply_button 노출(메인 CTA) → available
   *   2) .early_button 노출(메인 CTA) → closed
   *   3) (className 못 찾으면) APPLY_REGEX 라벨 매칭 → available
   *   4) ENROLLED_REGEX 라벨 매칭 → enrolled
   *   5) (마지막) CLOSED_REGEX 라벨 매칭 → closed
   *      (마지막인 이유: 추천 섹션 등 다른 위치의 동일 텍스트 충돌 방지)
   *   6) unknown
   */
  async checkStatus(): Promise<ChallengeStatus> {
    // 1) className-scope: 메인 CTA "apply_button"
    const applyBtnByClass = this.page.locator('button.apply_button').first();
    if (
      await applyBtnByClass.isVisible({ timeout: 3_000 }).catch(() => false)
    ) {
      log('    [checkStatus] .apply_button visible → available');
      return 'available';
    }
    // 2) className-scope: 메인 CTA "early_button" (NotiButton 의 closed 상태)
    const closedBtnByClass = this.page.locator('.early_button').first();
    if (await closedBtnByClass.isVisible().catch(() => false)) {
      log('    [checkStatus] .early_button visible → closed');
      return 'closed';
    }

    // 3) Fallback: 라벨 regex (className 이 변경됐거나 다른 페이지 구조)
    const hasApplyByLabel = await this.page
      .getByRole('button', { name: APPLY_REGEX })
      .or(this.page.getByRole('link', { name: APPLY_REGEX }))
      .first()
      .isVisible()
      .catch(() => false);
    if (hasApplyByLabel) {
      log('    [checkStatus] APPLY_REGEX label match → available');
      return 'available';
    }

    const isEnrolled = await this.page
      .getByRole('button', { name: ENROLLED_REGEX })
      .first()
      .isVisible()
      .catch(() => false);
    if (isEnrolled) {
      log('    [checkStatus] ENROLLED_REGEX label match → enrolled');
      return 'enrolled';
    }

    const isClosedByLabel = await this.page
      .getByRole('button', { name: CLOSED_REGEX })
      .or(this.page.getByRole('link', { name: CLOSED_REGEX }))
      .first()
      .isVisible()
      .catch(() => false);
    if (isClosedByLabel) {
      log('    [checkStatus] CLOSED_REGEX label match → closed');
      return 'closed';
    }

    log('    [checkStatus] no match → unknown');
    return 'unknown';
  }

  /** 신청 CTA 버튼 클릭. checkStatus() === 'available' 일 때만 호출. */
  async clickApply(extraMs?: number): Promise<void> {
    const button = this.page
      .getByRole('button', { name: APPLY_REGEX })
      .or(this.page.getByRole('link', { name: APPLY_REGEX }))
      .first();
    await expect(button, '신청 CTA 버튼이 보여야 한다').toBeVisible({
      timeout: 10_000,
    });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await this.settle(extraMs);
  }
}
