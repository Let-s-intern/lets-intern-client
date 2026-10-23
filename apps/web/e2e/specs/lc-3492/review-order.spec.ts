import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminMentorDetailPage } from '../../pages/admin/AdminMentorDetailPage';
import { LiveMentoringDetailPage } from '../../pages/LiveMentoringDetailPage';
import { MentorProfilePage } from '../../pages/MentorProfilePage';
import { Lc3492Api, MENTOR_A_EMAIL, setupRun } from '../../support/lc3492';

/**
 * 후기 노출 순서 (LC-3502) — 어드민 순서가 웹 프로필과 1:1 상세의 기본 정렬 「추천순」 이 된다.
 */
test.describe('LC-3492 후기 노출 순서', () => {
  const startRun = setupRun('LC-3492 review-order');

  test('4위 후기를 1위로 저장하면 두 웹 화면 추천순이 같은 순서다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );
    const admin = new AdminMentorDetailPage(page);

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));

    const expected = await flow.run(
      '2. 어드민 멘토 상세 — 4위를 1위로 → 순서 저장',
      async () => {
        await admin.goto(mentorId);
        const texts = await admin.exposedReviewTexts();
        test.skip(texts.length < 4, '노출 후기가 4개 미만이다(시드 확인)');
        await admin.setReviewRank(3, 1);
        const reordered = [texts[3], texts[0], texts[1], texts[2]];
        expect((await admin.exposedReviewTexts()).slice(0, 4)).toEqual(
          reordered,
        );
        await admin.saveReviewOrder();
        await admin.goto(mentorId);
        expect((await admin.exposedReviewTexts()).slice(0, 4)).toEqual(
          reordered,
        );
        return reordered;
      },
      '어드민-후기순서',
    );

    // 웹에는 본문이 있는 공개 후기만 나온다. 어드민 순서의 상대 순서가 같은지 본다
    const sameOrder = (shown: string[]) =>
      shown.filter((text) => expected.includes(text));

    await flow.run(
      '3. 웹 멘토 프로필 — 추천순',
      async () => {
        const profile = await new MentorProfilePage(page).goto(mentorId);
        expect(sameOrder(await profile.reviewTexts())).toEqual(expected);
      },
      '웹-프로필-추천순',
    );

    await flow.run(
      '4. 웹 1:1 상세 — 추천순',
      async () => {
        const detail = await new LiveMentoringDetailPage(page).goto(mentorId);
        await expect(page.getByRole('radio', { name: '추천순' })).toBeChecked();
        expect(sameOrder(await detail.reviewTexts())).toEqual(expected);
      },
      '웹-1on1-추천순',
    );
  });
});
