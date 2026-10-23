import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminLiveMentoringDetailPageEditPage } from '../../pages/admin/AdminLiveMentoringDetailPageEditPage';
import { LiveMentoringDetailPage } from '../../pages/LiveMentoringDetailPage';
import {
  Lc3492Api,
  MENTOR_A_EMAIL,
  setupRun,
  uniqueText,
} from '../../support/lc3492';

/** 어드민 1:1 상세페이지 수정 (LC-3496) — 핵심 소개 불릿을 고치면 웹 상세에 나온다 */
test.describe('LC-3492 어드민 상세페이지 수정', () => {
  const startRun = setupRun('LC-3492 detail-page-admin');

  test('핵심 소개 불릿을 고쳐 저장하면 웹 1:1 상세에 보인다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );
    const bullet = uniqueText('QA 핵심 소개');
    const editor = new AdminLiveMentoringDetailPageEditPage(page);

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));
    await flow.run(
      '2. 상세페이지 수정 — 첫 불릿 수정 → 저장',
      async () => {
        await editor.goto(mentorId);
        if ((await editor.heroBullet(0).count()) === 0) {
          await page.getByRole('button', { name: '소개 문구 추가 +' }).click();
        }
        await editor.heroBullet(0).fill(bullet);
        await editor.save();
      },
      '어드민-불릿저장',
    );

    await flow.run(
      '3. 웹 /live-mentoring/{mentorId} — 바뀐 불릿',
      async () => {
        await new LiveMentoringDetailPage(page).goto(mentorId);
        await expect(page.getByText(bullet).first()).toBeVisible();
      },
      '웹-불릿',
    );
  });
});
