import type { Page } from '@playwright/test';

/**
 * 페이지 이동/클릭 후 settle 대기 (정적).
 *
 * 단계: domcontentloaded -> networkidle -> optional extraMs buffer.
 * extraMs 기본 0 — 명시적으로 필요한 곳만 지정.
 *
 * 가능하면 settle 보다 waitForAnchor 를 우선 사용 (동적 대기).
 */
export async function settle(page: Page, extraMs = 0): Promise<void> {
  await page
    .waitForLoadState('domcontentloaded', { timeout: 10_000 })
    .catch(() => undefined);
  await page
    .waitForLoadState('networkidle', { timeout: 8_000 })
    .catch(() => undefined);
  if (extraMs > 0) {
    await page.waitForTimeout(extraMs);
  }
}

/**
 * 동적 대기 — CSS selector 들 중 어느 하나라도 visible 되면 즉시 반환.
 *
 * 정적 waitForTimeout 대비 장점:
 *   - 화면 준비되면 즉시 진행 (불필요 대기 없음)
 *   - 안 뜨면 최대 timeoutMs 까지 polling
 *
 * 예) waitForAnchor(page, ['.apply_button', '.early_button'])
 *   -> 신청 가능 또는 종료 상태 둘 중 어느 게 떠도 OK
 *
 * 반환값: 떴으면 true, 타임아웃 시 false (호출자가 fallback 처리).
 */
export async function waitForAnchor(
  page: Page,
  selectors: string[],
  timeoutMs = 15_000,
): Promise<boolean> {
  const combined = selectors.join(', ');
  return page
    .locator(combined)
    .first()
    .waitFor({ state: 'visible', timeout: timeoutMs })
    .then(() => true)
    .catch(() => false);
}
