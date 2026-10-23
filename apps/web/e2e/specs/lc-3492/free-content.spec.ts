import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminLiveMentoringDetailPageEditPage } from '../../pages/admin/AdminLiveMentoringDetailPageEditPage';
import { LiveMentoringDetailPage } from '../../pages/LiveMentoringDetailPage';
import {
  fakeImageUrl,
  Lc3492Api,
  MENTOR_A_EMAIL,
  MENTOR_PASSWORD,
  serveFakeImages,
  setupRun,
  uniqueText,
} from '../../support/lc3492';

const EDITABLE_KEYS = [
  'hero',
  'mentoringTypes',
  'strategy',
  'video',
  'results',
  'reviews',
] as const;

/**
 * 자유 입력란 (LC-3494) 과 배치 위치 (LC-3495).
 * 기준 섹션이 꺼져도 자리는 그대로이고, 멘토 앱 저장(freeContent 없음)은 어드민 입력을 지우지 않는다.
 */
test.describe('LC-3492 자유 입력란', () => {
  const startRun = setupRun('LC-3492 free-content');

  test('전략 뒤 자유 입력란 — 렌더 위치, 전략 off, 멘토 저장 후 유지', async ({
    page,
    request,
    context,
  }) => {
    const flow = startRun(page);
    await serveFakeImages(context);
    const mentorId = await flow.run('0. 멘토 A id(API)', async () =>
      (await Lc3492Api.admin(request)).mentorIdByEmail(MENTOR_A_EMAIL),
    );
    const text = uniqueText('QA 자유 입력란');
    const imageUrl = fakeImageUrl('free-content');
    const editor = new AdminLiveMentoringDetailPageEditPage(page);
    const web = new LiveMentoringDetailPage(page);

    const types = page.locator('#live-mentoring-types');
    const strategy = page.locator('#live-mentoring-different');
    const video = page.locator('#live-mentoring-video');

    /** 자유 입력란이 유형 뒤·영상 앞에 있는지. 섹션이 없으면 그 쪽 비교는 건너뛴다 */
    const expectBetweenTypesAndVideo = async () => {
      const free = web.freeContent();
      if (await types.count())
        expect(await web.isBefore(types, free)).toBe(true);
      if (await video.count())
        expect(await web.isBefore(free, video)).toBe(true);
    };

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));
    await flow.run(
      '2. 자유 입력란 — 글·이미지, 위치 「취업 성공 전략 뒤」 → 저장',
      async () => {
        await editor.goto(mentorId);
        // 전략 섹션을 켜 둔다. 제목·설명이 비어 있으면 켜는 순간 저장이 막히므로 그때는 그대로 둔다
        await editor.openTab('취업 성공 전략');
        const title = await page
          .getByLabel('섹션 제목', { exact: true })
          .inputValue();
        const subtitle = await page
          .getByLabel('섹션 설명', { exact: true })
          .inputValue();
        if (title.trim() && subtitle.trim()) await editor.setVisible(true);
        else flow.note('전략 제목·설명이 비어 전략 노출을 켜지 않음');
        await editor.openTab('자유 입력란');
        await editor.setVisible(true);
        await editor.selectFreeContentPosition('취업 성공 전략 뒤');
        await editor.writeFreeContent(text);
        await editor.insertImageByUrl(imageUrl);
        await editor.save();
      },
      '어드민-자유입력란',
    );

    await flow.run(
      '3. 웹 — 전략 섹션 다음에 렌더, 이미지 보임',
      async () => {
        await web.goto(mentorId);
        const free = web.freeContent();
        await expect(free).toHaveAttribute(
          'data-free-content',
          'AFTER_STRATEGY',
        );
        await expect(free).toContainText(text);
        await expect(free.locator(`img[src="${imageUrl}"]`)).toBeVisible();
        if (await strategy.count()) {
          expect(await web.isBefore(strategy, free)).toBe(true);
        } else {
          flow.note(
            '전략 섹션이 그려지지 않음(Point 없음) — 유형·영상 사이만 확인',
          );
        }
        await expectBetweenTypesAndVideo();
      },
      '웹-전략뒤',
    );

    await flow.run(
      '4. 전략 visible=false 로 저장 → 웹에서 유형과 영상 사이',
      async () => {
        await editor.goto(mentorId);
        await editor.openTab('취업 성공 전략');
        await editor.setVisible(false);
        await editor.save();
        await web.goto(mentorId);
        await expect(strategy).toHaveCount(0);
        await expect(web.freeContent()).toContainText(text);
        await expectBetweenTypesAndVideo();
      },
      '웹-전략off',
    );

    await flow.run(
      '5. 멘토 계정으로 PUT /mentor/live-mentoring/detail-page(자유 입력란 없음) → 웹에서 유지',
      async () => {
        const mentorApi = await Lc3492Api.login(
          request,
          MENTOR_A_EMAIL,
          MENTOR_PASSWORD,
        );
        const current = await mentorApi.get<Record<string, unknown>>(
          '/v1/mentor/live-mentoring/detail-page',
        );
        // 멘토 앱 저장 본문과 같은 6키. freeContent 는 보내지 않는다
        const body = Object.fromEntries(
          EDITABLE_KEYS.map((key) => [key, current[key]]),
        );
        await mentorApi.put('/v1/mentor/live-mentoring/detail-page', body);
        await web.goto(mentorId);
        await expect(web.freeContent()).toContainText(text);
      },
      '웹-멘토저장후유지',
    );
  });
});
