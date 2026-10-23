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
      '2. 대표가 아닌 경력에 「대표로 지정」 → 웹 /mentors 카드 회사·직무가 바뀜',
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
      '4. 경력 수정(직무·경력 로고) + 대표 로고 라이브러리 선택 → 저장',
      async () => {
        await admin.goto(mentorId);
        await admin.editCareer(company, { job: newJob, logoName });
        await admin.pickCorpLogo(logoName);
        const body = await admin.saveBasicInfo();
        expect(body.corpImgUrl).toBe(logoUrl);
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
  });
});
