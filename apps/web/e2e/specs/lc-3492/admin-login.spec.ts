import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminMentorPickPage } from '../../pages/admin/AdminMentorPickPage';
import { setupRun } from '../../support/lc3492';

/** 어드민 로그인 스모크 — 나머지 스펙이 모두 이 흐름으로 시작한다 */
test.describe('LC-3492 어드민 로그인', () => {
  const startRun = setupRun('LC-3492 어드민 로그인');

  test('어드민 로그인 후 렛커 픽 화면이 열린다', async ({ page }) => {
    const flow = startRun(page);

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page), '로그인');
    await flow.run(
      '2. 렛커 픽 화면',
      async () => {
        await new AdminMentorPickPage(page).goto();
        await expect(
          page.getByRole('button', { name: '순서 저장' }),
        ).toBeVisible();
      },
      '렛커픽',
    );
  });
});
