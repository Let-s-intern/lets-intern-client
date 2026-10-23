import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminMentorDetailPage } from '../../pages/admin/AdminMentorDetailPage';
import { LiveMentoringDetailPage } from '../../pages/LiveMentoringDetailPage';
import { MentorListPage } from '../../pages/MentorListPage';
import { MentorProfilePage } from '../../pages/MentorProfilePage';
import {
  Lc3492Api,
  MENTOR_A_EMAIL,
  setupRun,
  uniqueText,
} from '../../support/lc3492';

/**
 * 어드민 멘토 한줄소개·프로필 상세페이지·키워드 수정 (LC-3501).
 * 본문을 고치지 않은 저장은 description 을 보내지 않아 멘토가 고친 본문을 덮지 않는다.
 */
test.describe('LC-3492 멘토 프로필 소개·키워드', () => {
  const startRun = setupRun('LC-3492 mentor-description');

  test('한줄소개·본문·키워드를 어드민에서 고치면 웹에 반영된다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );
    const admin = new AdminMentorDetailPage(page);
    const intro1 = uniqueText('QA 한줄소개');
    const description = uniqueText('QA 프로필 상세페이지 본문');

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));

    await flow.run(
      '2. 한줄소개 + 프로필 상세페이지 본문 수정 → 저장',
      async () => {
        await admin.goto(mentorId);
        await admin.setIntroduction(intro1);
        await admin.replaceDescription(description);
        const body = await admin.saveBasicInfo();
        expect(body.introduction).toBe(intro1);
        expect(String(body.description)).toContain(description);
      },
      '어드민-소개저장',
    );

    await flow.run(
      '3. 웹 프로필 — 한줄소개·본문',
      async () => {
        const profile = await new MentorProfilePage(page).goto(mentorId);
        await expect(profile.introSection()).toContainText(intro1);
        await expect(profile.introSection()).toContainText(description);
      },
      '웹-프로필소개',
    );

    await flow.run(
      '4. 웹 1:1 상세 — 멘토님의 한마디에 한줄소개',
      async () => {
        const detail = await new LiveMentoringDetailPage(page).goto(mentorId);
        await expect(detail.oneLinerBox()).toContainText(intro1);
      },
      '웹-한마디',
    );

    const intro2 = uniqueText('QA 한줄소개만');
    await flow.run(
      '5. 한줄소개만 수정 → 요청에 description 없음, 본문 유지',
      async () => {
        await admin.goto(mentorId);
        await admin.setIntroduction(intro2);
        const body = await admin.saveBasicInfo();
        expect(body.introduction).toBe(intro2);
        expect(body).not.toHaveProperty('description');
        const profile = await new MentorProfilePage(page).goto(mentorId);
        await expect(profile.introSection()).toContainText(intro2);
        await expect(profile.introSection()).toContainText(description);
      },
      '웹-본문유지',
    );

    await flow.run(
      '6. 멘토 키워드 2개 지정 → 웹 /mentors 키워드 필터에 그 멘토',
      async () => {
        await admin.goto(mentorId);
        const keywords = (await admin.unselectedKeywords()).slice(0, 2);
        test.skip(
          keywords.length < 2,
          '고르지 않은 키워드가 2개 미만이다(시드 확인)',
        );
        for (const keyword of keywords)
          await admin.keywordChip(keyword).click();
        const hashTagSaved = page.waitForResponse(
          (res) =>
            res.url().includes(`/admin/mentor-hash-tag/mentors/${mentorId}`) &&
            res.request().method() === 'PUT',
        );
        await admin.saveBasicInfo();
        expect((await hashTagSaved).ok(), '키워드 저장이 성공해야 한다').toBe(
          true,
        );

        const list = await new MentorListPage(page).goto();
        await list.filterByKeyword(keywords[0]);
        await expect(list.card(mentorId)).toBeVisible();
      },
      '웹-키워드필터',
    );
  });
});
