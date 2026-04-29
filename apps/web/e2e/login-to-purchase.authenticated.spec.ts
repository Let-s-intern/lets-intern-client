import { test, expect } from '@playwright/test';

/**
 * 시나리오: 로그인 → 챌린지 구매 (사용자 실제 UX 플로우 기준)
 *
 * 흐름:
 *   1) 렛츠커리어 홈 진입
 *   2) 상단 "프로그램" 카테고리 드롭다운 → "전체 프로그램" 클릭
 *   3) 프로그램 목록에서 "E2E_TEST-login_to_purchase" 챌린지 클릭
 *   4) 챌린지 상세에서 "바로 신청" 클릭
 *   5) "신청하기" 클릭 (모달/결제 입력)
 *   6) "0원 결제하기" 클릭 — 무료 옵션이라 PG 안 거치고 즉시 성공 처리됨
 *   7) 결제 결과 페이지 도달 확인
 *
 * 의존:
 *   - globalSetup 이 storageState 를 만들었어야 함 (E2E_TEST_USER_EMAIL/PW)
 *   - 봇 계정이 해당 챌린지에 아직 신청하지 않은 상태여야 함
 *     (이미 신청 상태면 "바로 신청" 대신 "시작하기" 가 보여서 자동 skip)
 *   - 챌린지 가격이 무료(0원) 여야 함 — 마지막 단계의 "0원 결제하기" 버튼 라벨로 검증
 */

const TEST_CHALLENGE_TITLE = 'E2E_TEST-login_to_purchase';

const hasCredentials = Boolean(
  process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PW,
);

test.describe('login → purchase (free option)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );

  test('홈 → 전체 프로그램 → 테스트 챌린지 → 바로 신청 → 0원 결제', async ({
    page,
  }) => {
    // ────────────────────────────────────────────────────────────
    // 1) 렛츠커리어 홈
    // ────────────────────────────────────────────────────────────
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // ────────────────────────────────────────────────────────────
    // 2) 상단 "프로그램" 드롭다운 → "전체 프로그램"
    //    데스크톱에선 hover 로 열리는 게 일반적. click 도 fallback.
    // ────────────────────────────────────────────────────────────
    const programsTrigger = page
      .getByRole('button', { name: /^프로그램$/ })
      .or(page.getByRole('link', { name: /^프로그램$/ }))
      .first();
    await expect(
      programsTrigger,
      '상단 네비게이션의 "프로그램" 카테고리가 보여야 한다',
    ).toBeVisible({ timeout: 10_000 });
    await programsTrigger.hover();

    const allProgramsLink = page
      .getByRole('link', { name: /전체\s*프로그램/i })
      .first();
    // hover 로 안 열리면 click 해서 열기 시도
    if (!(await allProgramsLink.isVisible().catch(() => false))) {
      await programsTrigger.click({ trial: false }).catch(() => undefined);
    }
    await expect(
      allProgramsLink,
      '드롭다운에 "전체 프로그램" 링크가 보여야 한다',
    ).toBeVisible({ timeout: 5_000 });
    await allProgramsLink.click();

    // ────────────────────────────────────────────────────────────
    // 3) 프로그램 목록에서 테스트 챌린지 클릭
    // ────────────────────────────────────────────────────────────
    await page.waitForLoadState('domcontentloaded');
    const challengeLink = page
      .getByRole('link', { name: new RegExp(TEST_CHALLENGE_TITLE, 'i') })
      .first();
    await expect(
      challengeLink,
      `전체 프로그램 목록에 "${TEST_CHALLENGE_TITLE}" 챌린지가 보여야 한다`,
    ).toBeVisible({ timeout: 15_000 });
    await challengeLink.click();

    // 챌린지 상세 redirect 대기 ([id] → [id]/[slug])
    await page.waitForURL(/\/program\/challenge\/[^/]+\/[^/]+/, {
      timeout: 15_000,
    });
    await expect(page).toHaveTitle(new RegExp(TEST_CHALLENGE_TITLE, 'i'), {
      timeout: 10_000,
    });

    // ────────────────────────────────────────────────────────────
    // 4) "바로 신청" 클릭
    //    이미 신청한 봇이면 "시작하기" 가 보이므로 그땐 skip.
    // ────────────────────────────────────────────────────────────
    const alreadyEnrolled = await page
      .getByRole('button', {
        name: /시작하기|내\s*라이브러리|이미\s*신청|수강\s*중/i,
      })
      .first()
      .isVisible()
      .catch(() => false);

    test.skip(
      alreadyEnrolled,
      '봇 계정이 이미 해당 챌린지에 신청한 상태입니다. ' +
        'BE 에서 봇의 신청 이력을 리셋한 뒤 재실행하세요.',
    );

    const applyNowButton = page
      .getByRole('button', { name: /바로\s*신청/i })
      .first();
    await expect(applyNowButton, '"바로 신청" 버튼이 보여야 한다').toBeVisible({
      timeout: 10_000,
    });
    await applyNowButton.click();

    // ────────────────────────────────────────────────────────────
    // 5) "신청하기" 클릭 (모달 또는 결제 입력 화면)
    // ────────────────────────────────────────────────────────────
    const enrollButton = page
      .getByRole('button', { name: /^신청하기$/ })
      .first();
    await expect(enrollButton, '"신청하기" 버튼이 보여야 한다').toBeVisible({
      timeout: 10_000,
    });
    await enrollButton.click();

    // ────────────────────────────────────────────────────────────
    // 6) "0원 결제하기" 클릭
    //    버튼 라벨에 "0원" 이 들어 있는지가 가격 안전 가드 역할.
    //    유료 챌린지였다면 라벨이 "N,000원 결제하기" 같이 다를 것.
    // ────────────────────────────────────────────────────────────
    const payZeroButton = page
      .getByRole('button', { name: /0\s*원\s*결제/i })
      .first();
    await expect(
      payZeroButton,
      '"0원 결제하기" 버튼이 보여야 한다 (안전 가드: 무료 옵션 확인)',
    ).toBeVisible({ timeout: 10_000 });
    await payZeroButton.click();

    // ────────────────────────────────────────────────────────────
    // 7) 결제 결과 페이지 도달 확인
    //    BE 가 0원 결제를 PG 우회 처리해서 /order/result 로 즉시 이동하거나,
    //    /library 같은 후속 라우트로 갈 수도 있음. 두 가지 모두 수용.
    // ────────────────────────────────────────────────────────────
    await page.waitForURL(/\/order\/result|\/library/, { timeout: 30_000 });
    await expect(
      page
        .getByText(/결제\s*완료|주문\s*완료|신청\s*완료|성공/i)
        .or(page.getByText(/내\s*라이브러리|학습\s*시작/i))
        .first(),
      '결제 결과 또는 라이브러리 페이지에 성공 안내가 표시되어야 한다',
    ).toBeVisible({ timeout: 15_000 });
  });
});
