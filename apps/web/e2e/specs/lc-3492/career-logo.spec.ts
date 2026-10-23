import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminCompanyLogoPage } from '../../pages/admin/AdminCompanyLogoPage';
import { AdminMentorDetailPage } from '../../pages/admin/AdminMentorDetailPage';
import { LiveMentoringDetailPage } from '../../pages/LiveMentoringDetailPage';
import { MentorListPage } from '../../pages/MentorListPage';
import { MentorProfilePage } from '../../pages/MentorProfilePage';
import {
  Lc3492Api,
  MENTOR_A_EMAIL,
  mockFileUpload,
  serveFakeImages,
  setupRun,
  uniqueText,
} from '../../support/lc3492';

/**
 * 경력 수정·대표 지정 (LC-3497), 회사 로고 라이브러리 (LC-3498), 로고 지정 (LC-3499).
 * 로고 지정은 라이브러리 로고에 연결하는 방식이라, 라이브러리 이미지를 바꾸면 연결된 멘토 로고도 바뀐다.
 */
test.describe('LC-3492 경력·회사 로고', () => {
  const startRun = setupRun('LC-3492 career-logo');

  test('대표 지정 → 로고 등록 → 경력 수정·로고 지정 → 웹 반영', async ({
    page,
    request,
    context,
  }) => {
    const flow = startRun(page);
    await serveFakeImages(context);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );
    const admin = new AdminMentorDetailPage(page);
    const logoName = uniqueText('QA로고');
    const newJob = uniqueText('QA직무');

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));

    const company = await flow.run(
      '2. 대표가 아닌 경력에 「대표로 지정」(확인 창) → 웹 /mentors 카드 회사·직무가 바뀜',
      async () => {
        await admin.goto(mentorId);
        const [target] = await admin.nonRepresentativeCompanies();
        test.skip(!target, '대표가 아닌 경력이 없다(시드 확인)');
        await admin.setRepresentative(target);
        await expect(admin.careerRow(target)).toContainText('대표 경력');

        const list = await new MentorListPage(page).goto();
        await expect(list.card(mentorId)).toContainText(target);
        return target;
      },
      '대표지정-웹카드',
    );

    const logoUrl = await flow.run(
      '3. 회사 로고 등록 → 검색',
      async () => {
        if (await mockFileUpload(page, 'qa-company-logo')) {
          flow.note(
            '로컬 업로드 대신 POST /file 응답을 가짜 HTTPS 주소로 대체',
          );
        }
        const logos = await new AdminCompanyLogoPage(page).goto();
        await logos.register(logoName);
        await logos.search(logoName);
        const card = logos.card(logoName);
        await expect(card).toBeVisible();
        return card.locator('img').getAttribute('src');
      },
      '로고등록-검색',
    );

    await flow.run(
      '4. 경력 수정(직무) + 경력 로고 칸에서 바로 연결 + 대표 로고 라이브러리 연결 → 저장',
      async () => {
        await admin.goto(mentorId);
        await admin.editCareer(company, { job: newJob });
        await admin.setCareerLogo(company, logoName);
        await admin.pickCorpLogo(logoName);
        const corpLogoLinked = page.waitForResponse(
          (res) =>
            res.url().includes(`/admin/user/${mentorId}/corp-logo`) &&
            res.request().method() === 'PATCH',
        );
        const body = await admin.saveBasicInfo();
        // 연결 방식이라 대표 로고 주소는 프로필 PATCH 에 싣지 않는다
        expect(body).not.toHaveProperty('corpImgUrl');
        const linked = await corpLogoLinked;
        expect(linked.ok(), '대표 로고 연결이 성공해야 한다').toBe(true);
        expect(linked.request().postDataJSON()).toEqual({
          companyLogoId: expect.any(Number),
        });
      },
      '경력수정-로고지정',
    );

    await flow.run(
      '5. 웹 프로필 — 경력 줄 로고, 바뀐 직무',
      async () => {
        const profile = await new MentorProfilePage(page).goto(mentorId);
        const row = profile.careerRow(company);
        await expect(row.locator('img')).toHaveAttribute('src', logoUrl ?? '');
        await expect(profile.heroAffiliation()).toContainText(newJob);
      },
      '웹-프로필로고',
    );

    await flow.run(
      '6. 웹 1:1 상세 — 경력 줄 로고',
      async () => {
        const detail = await new LiveMentoringDetailPage(page).goto(mentorId);
        await expect(
          detail.careerLine(company).locator(`img[src="${logoUrl}"]`),
        ).toBeVisible();
      },
      '웹-1on1로고',
    );

    await flow.run(
      '7. 라이브러리에서 그 로고 이미지 수정 → 웹 프로필·1:1 상세 경력 로고가 새 주소로 바뀜',
      async () => {
        if (await mockFileUpload(page, 'qa-company-logo-v2')) {
          flow.note(
            '로고 이미지 수정도 POST /file 응답을 가짜 HTTPS 주소로 대체',
          );
        }
        const logos = await new AdminCompanyLogoPage(page).goto();
        await logos.search(logoName);
        await logos.replaceImage(logoName);
        const newLogoUrl = await logos
          .card(logoName)
          .locator('img')
          .getAttribute('src');
        expect(newLogoUrl).not.toBe(logoUrl);

        const profile = await new MentorProfilePage(page).goto(mentorId);
        await expect(profile.careerRow(company).locator('img')).toHaveAttribute(
          'src',
          newLogoUrl ?? '',
        );
        const detail = await new LiveMentoringDetailPage(page).goto(mentorId);
        await expect(
          detail.careerLine(company).locator(`img[src="${newLogoUrl}"]`),
        ).toBeVisible();
      },
      '로고교체-웹반영',
    );
  });
});
