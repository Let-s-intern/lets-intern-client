import { expect, test } from '@playwright/test';
import { MentorProfilePage } from '../../pages/MentorProfilePage';
import { Lc3492Api, MENTOR_A_EMAIL, setupRun } from '../../support/lc3492';

/**
 * 멘토 프로필 세미나·VOD (LC-3503). 시드: 멘토 A 에 LIVE 모집중 1·마감 1, VOD 노출 1·비노출 1,
 * 멘토 미연결 LIVE 1. 비노출 VOD 와 미연결 LIVE 는 시드 제목으로 없는지 본다.
 */
const HIDDEN_VOD_TITLE =
  process.env.E2E_LC3492_HIDDEN_VOD_TITLE ?? 'LC3492 비노출 VOD';
const UNLINKED_LIVE_TITLE =
  process.env.E2E_LC3492_UNLINKED_LIVE_TITLE ?? 'LC3492 미연결 LIVE';

test.describe('LC-3492 멘토 프로필 세미나·VOD', () => {
  const startRun = setupRun('LC-3492 mentor-programs');

  test('모집중에 LIVE·VOD, 진행했던에 LIVE 가 나온다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );

    await flow.run(
      '1. 웹 /mentors/{멘토 A}',
      async () => {
        const profile = await new MentorProfilePage(page).goto(mentorId);
        const proceeding = profile.programSection('모집 중인 프로그램');
        const past = profile.programSection('진행했던 프로그램');

        // LIVE 카드는 /program/live, VOD 는 /program/vod 로 간다
        await expect(
          proceeding.locator('a[href^="/program/live/"]', { hasText: 'LIVE' }),
        ).toHaveCount(1);
        const vod = proceeding.locator('a[href^="/program/vod/"]');
        await expect(vod).toHaveCount(1);
        await expect(vod).toContainText('VOD');
        await expect(vod).toContainText('상시');

        await expect(
          past.locator('a[href^="/program/live/"]', { hasText: 'LIVE' }),
        ).toHaveCount(1);
        await expect(past.locator('a[href^="/program/vod/"]')).toHaveCount(0);

        await expect(page.getByText(HIDDEN_VOD_TITLE)).toHaveCount(0);
        await expect(page.getByText(UNLINKED_LIVE_TITLE)).toHaveCount(0);
      },
      '웹-프로필-프로그램',
    );
  });
});
