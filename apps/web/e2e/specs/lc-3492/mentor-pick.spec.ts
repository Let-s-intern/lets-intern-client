import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminMentorPickPage } from '../../pages/admin/AdminMentorPickPage';
import { LiveMentoringListPage } from '../../pages/LiveMentoringListPage';
import { MentorListPage } from '../../pages/MentorListPage';
import { Lc3492Api, setupRun } from '../../support/lc3492';

/**
 * 렛커 픽 (LC-3500) — 어드민 픽 하나가 웹 /mentors 와 /live-mentoring 두 목록에 같이 적용된다.
 * 픽은 1페이지 맨 앞에 픽 순서대로, 「렛커 픽」 라벨. 비노출 멘토는 픽이어도 나가지 않는다.
 */
test.describe('LC-3492 렛커 픽 노출', () => {
  const startRun = setupRun('LC-3492 mentor-pick');

  test('픽 저장 후 두 웹 목록 맨 앞에 픽 순서대로 나온다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);

    const { visiblePickIds, hiddenId } = await flow.run(
      '0. 픽 준비(API) — 1:1 개설 멘토 둘을 기본 정렬과 반대로 + 비노출 멘토',
      async () => {
        const api = await Lc3492Api.admin(request);
        const mentors = await api.mentors();
        // seed-live-mentoring 의 멘토들은 1:1 개설이 있어 두 목록에 모두 나온다
        const liveMentors = mentors
          .filter((mentor) => mentor.email?.startsWith('lm-mentor'))
          .sort((a, b) => a.id - b.id)
          .slice(0, 2)
          .map((mentor) => mentor.id);
        const hidden = mentors.find((mentor) => mentor.isVisible === false);
        test.skip(liveMentors.length < 2, '1:1 시드 멘토가 둘 이상 필요하다');
        await api.setPicks([...liveMentors, ...(hidden ? [hidden.id] : [])]);
        if (!hidden)
          flow.note('비노출 멘토가 시드에 없어 비노출 확인을 건너뜀');
        return { visiblePickIds: liveMentors, hiddenId: hidden?.id };
      },
    );

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));
    await flow.run(
      '2. 어드민 픽 목록 — 비노출 표시',
      async () => {
        await new AdminMentorPickPage(page).goto();
        if (hiddenId)
          await expect(page.getByText('비노출', { exact: true })).toBeVisible();
      },
      '어드민-픽',
    );

    await flow.run(
      '3. 웹 /mentors — 1페이지 맨 앞에 픽 순서대로, 렛커 픽 라벨',
      async () => {
        const list = await new MentorListPage(page).goto();
        const ids = await list.mentorIds();
        expect(ids.slice(0, visiblePickIds.length)).toEqual(visiblePickIds);
        expect(await list.pickedMentorIds()).toEqual(visiblePickIds);
        if (hiddenId) expect(ids).not.toContain(hiddenId);
      },
      '웹-멘토목록',
    );

    await flow.run(
      '4. 웹 /live-mentoring — 픽 멘토의 개설이 맨 앞에 픽 순서대로',
      async () => {
        const list = await new LiveMentoringListPage(page).goto();
        const ids = await list.mentorIds();
        const pickedInList = visiblePickIds.filter((id) => ids.includes(id));
        expect(ids.slice(0, pickedInList.length)).toEqual(pickedInList);
        expect(await list.pickedCount()).toBe(pickedInList.length);
        if (hiddenId) expect(ids).not.toContain(hiddenId);
      },
      '웹-1on1목록',
    );
  });
});
