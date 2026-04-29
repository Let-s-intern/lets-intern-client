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
   * 상세 페이지 로드 대기 (동적, 초기 flash 고려).
   *
   * 페이지 렌더 시점 — 데이터가 도착하기 전 .early_button(출시알림신청) 이
   * 잠시 노출되었다 BE 응답 후 .apply_button(신청하기) 으로 전이되는
   * UI 패턴 대응.
   *
   * 검증 순서:
   *   1) URL: /program/challenge/[id]/[slug] redirect 완료 대기
   *   2) 제목 검증 (제공된 경우)
   *   3) **apply_button 을 우선 8초간 polling** — 전이 후 stable 상태 캐치
   *   4) 8초 안에 apply 가 안 뜨면 진짜 종료 상태로 간주 → early_button /
   *      "시작하기" / "내 라이브러리" / "이미 신청" 중 하나 visible 까지 대기
   *
   * extraMs 는 anchor 가 떴어도 추가로 더 기다릴 양 (기본 0).
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

    // 1차: apply_button(신청 가능) 을 우선 polling.
    //      flash 동안 .early_button 이 잠시 떠도, .apply_button 이 곧
    //      나타나면 그 시점에 즉시 진행 → 신청 가능 상태로 정착.
    const applyAppeared = await this.page
      .locator('button.apply_button')
      .first()
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (applyAppeared) {
      log('    [waitForLoaded] .apply_button 도착 → 신청 가능 상태로 정착');
    } else {
      // 2차: 8초 안에 apply 가 안 떴음 → 진짜 종료/이미신청 상태.
      //      여러 final state anchor 중 하나가 visible 될 때까지.
      log(
        '    [waitForLoaded] .apply_button 미도착 → final state(early/시작하기/...) 대기',
      );
      await waitForAnchor(
        this.page,
        [
          '.early_button',
          'button:has-text("시작하기")',
          'button:has-text("내 라이브러리")',
          'button:has-text("이미 신청")',
        ],
        7_000,
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
    // 0) "이미 신청 완료" 모달 우선 감지 — 페이지 어디든 노출되면 즉시 enrolled.
    const alreadyEnrolledOverlay = await this.page
      .getByText(/이미\s*신청\s*완료|이미\s*가입|이미\s*등록/i)
      .first()
      .isVisible({ timeout: 500 })
      .catch(() => false);
    if (alreadyEnrolledOverlay) {
      log('    [checkStatus] "이미 신청 완료" 오버레이 감지 → enrolled');
      return 'enrolled';
    }

    // 1) className-scope: 메인 CTA "apply_button"
    //    isApplied 상태일 때 같은 클래스를 가진 채로 텍스트가 "신청 완료" 로 바뀌고
    //    disabled 됨 (OverviewContent.tsx 참조). text + disabled 조합으로 판정.
    const applyBtnByClass = this.page.locator('button.apply_button').first();
    if (
      await applyBtnByClass.isVisible({ timeout: 1_000 }).catch(() => false)
    ) {
      const rawText =
        (await applyBtnByClass.textContent().catch(() => '')) ?? '';
      const text = rawText.trim();
      const disabled = await applyBtnByClass.isDisabled().catch(() => false);
      log(
        `    [checkStatus] .apply_button text="${text}" disabled=${disabled}`,
      );

      // "신청 완료" / "이미 신청" / disabled — 이미 신청한 상태.
      if (disabled || /신청\s*완료|이미\s*신청/i.test(text)) {
        log('    [checkStatus] disabled 또는 "신청 완료" 텍스트 → enrolled');
        return 'enrolled';
      }
      log('    [checkStatus] .apply_button enabled → available');
      return 'available';
    }
    // 2) className-scope: 메인 CTA "early_button" (NotiButton 의 closed 상태)
    const closedBtnByClass = this.page.locator('.early_button').first();
    if (
      await closedBtnByClass.isVisible({ timeout: 1_000 }).catch(() => false)
    ) {
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

  /**
   * 신청 CTA 버튼 클릭. checkStatus() === 'available' 일 때만 호출.
   * 클릭 직후 "이미 신청 완료" 모달이 떠도 감지해 호출자에게 알림.
   */
  async clickApply(extraMs?: number): Promise<{ alreadyEnrolled: boolean }> {
    // 안전 가드: 클릭 전에 disabled 한 번 더 검사 — flash 직후 잘못 진입 방지.
    const applyBtn = this.page.locator('button.apply_button').first();
    if (await applyBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      const text = (
        (await applyBtn.textContent().catch(() => '')) ?? ''
      ).trim();
      const disabled = await applyBtn.isDisabled().catch(() => false);
      if (disabled || /신청\s*완료|이미\s*신청/i.test(text)) {
        log(
          `    [clickApply] 이미 신청 상태 (text="${text}", disabled=${disabled}) — 클릭 skip`,
        );
        return { alreadyEnrolled: true };
      }
    }

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

    // 클릭 후 "이미 신청 완료" 모달 감지.
    const alreadyEnrolledModal = await this.page
      .getByText(/이미\s*신청\s*완료|이미\s*가입|이미\s*등록/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
    if (alreadyEnrolledModal) {
      log('    [clickApply] 클릭 후 "이미 신청 완료" 모달 노출 — enrolled');
      return { alreadyEnrolled: true };
    }
    return { alreadyEnrolled: false };
  }
}
