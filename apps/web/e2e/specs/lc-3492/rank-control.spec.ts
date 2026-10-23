import { expect, test } from '@playwright/test';
import { adminLoginFlow } from '../../flows/AdminLoginFlow';
import { AdminMentorPickPage } from '../../pages/admin/AdminMentorPickPage';
import { Lc3492Api, setupRun } from '../../support/lc3492';

/**
 * 노출 순서 공통 UI (LC-3493) — 렛커 픽 화면(LC-3500)에서 확인한다.
 * 숫자 입력은 끼워 넣기, 위·아래 버튼은 이웃과 교체, 비정상 입력은 경계값·원래 값.
 */
test.describe('LC-3492 노출 순서 조작', () => {
  const startRun = setupRun('LC-3492 rank-control');

  test('픽 5명 순서를 숫자·버튼으로 바꾸고 저장한다', async ({
    page,
    request,
  }) => {
    const flow = startRun(page);
    const pick = new AdminMentorPickPage(page);

    const names = await flow.run('0. 픽 5명 준비(API)', async () => {
      const api = await Lc3492Api.admin(request);
      const mentors = (await api.mentors()).slice(0, 5);
      test.skip(
        mentors.length < 5,
        '멘토가 5명 미만이라 순서 시나리오를 돌릴 수 없다',
      );
      await api.setPicks(mentors.map((mentor) => mentor.id));
      return mentors.map((mentor) => mentor.name);
    });
    const [A, B, C, D, E] = names;

    await flow.run('1. 어드민 로그인', () => adminLoginFlow(page));
    await flow.run(
      '2. 픽 화면 — 등록 순서 A B C D E',
      async () => {
        await pick.goto();
        expect(await pick.names()).toEqual([A, B, C, D, E]);
      },
      '픽-초기',
    );

    await flow.run(
      '3. 3위 입력칸에 1 → 저장 → 새로고침',
      async () => {
        await pick.enterRank(2, '1');
        expect(await pick.names()).toEqual([C, A, B, D, E]);
        await pick.saveOrder();
        await pick.goto();
        expect(await pick.names()).toEqual([C, A, B, D, E]);
        await expect(pick.upButton(0)).toBeDisabled();
        await expect(pick.downButton(4)).toBeDisabled();
      },
      '픽-3위를1위로',
    );

    await flow.run(
      '4. 3위 아래 버튼 → 저장 → 3위·4위 교체',
      async () => {
        await pick.downButton(2).click();
        await pick.saveOrder();
        await pick.goto();
        expect(await pick.names()).toEqual([C, A, D, B, E]);
      },
      '픽-아래버튼',
    );

    await flow.run(
      '5. 입력칸에 0 · 99 · abc',
      async () => {
        // 4위(B)에 0 → 1위
        await pick.enterRank(3, '0');
        expect(await pick.names()).toEqual([B, C, A, D, E]);
        // 1위(B)에 99 → 마지막
        await pick.enterRank(0, '99');
        expect(await pick.names()).toEqual([C, A, D, E, B]);
        // 숫자가 아니면 원래 값
        await pick.enterRank(1, 'abc');
        await expect(pick.rankInput(1)).toHaveValue('2');
        expect(await pick.names()).toEqual([C, A, D, E, B]);
      },
      '픽-경계값',
    );
  });
});
