import type { Page } from '@playwright/test';

/**
 * 페이지 이동/클릭 후 settle 대기.
 * domcontentloaded → networkidle → 추가 buffer 순으로 BE fetch + React state 안정화 대기.
 */
export async function settle(page: Page, extraMs = 800): Promise<void> {
  await page
    .waitForLoadState('domcontentloaded', { timeout: 10_000 })
    .catch(() => undefined);
  await page
    .waitForLoadState('networkidle', { timeout: 8_000 })
    .catch(() => undefined);
  await page.waitForTimeout(extraMs);
}
