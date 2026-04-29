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
 *   - 챌린지 가격이 무료(0원) 여야 함
 */

const TEST_CHALLENGE_TITLE = 'E2E_TEST-login_to_purchase';

const hasCredentials = Boolean(
  process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PW,
);

/** 터미널에 보기 좋게 진행 로그 출력. */
function log(message: string) {
  const ts = new Date().toISOString().slice(11, 19);
  // eslint-disable-next-line no-console
  console.log(`[E2E ${ts}] ${message}`);
}

test.describe('login → purchase (free option)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );

  test('홈 → 전체 프로그램 → 테스트 챌린지 → 바로 신청 → 0원 결제', async ({
    page,
  }) => {
    log('▶ 시나리오 시작');

    // ────────────────────────────────────────────────────────────
    // 1) 렛츠커리어 홈
    // ────────────────────────────────────────────────────────────
    await test.step('1. 홈 진입', async () => {
      log('  → 홈 진입 시도');
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      log(`  ✓ 홈 진입 성공 (url=${page.url()})`);
    });

    // ────────────────────────────────────────────────────────────
    // 2) 상단 "프로그램" 드롭다운 → "전체 프로그램"
    // ────────────────────────────────────────────────────────────
    await test.step('2. 프로그램 드롭다운 → 전체 프로그램', async () => {
      log('  → "프로그램" 카테고리 hover 시도');
      const programsTrigger = page
        .getByRole('button', { name: /^프로그램$/ })
        .or(page.getByRole('link', { name: /^프로그램$/ }))
        .first();
      await expect(
        programsTrigger,
        '상단 네비게이션의 "프로그램" 카테고리가 보여야 한다',
      ).toBeVisible({ timeout: 10_000 });
      await programsTrigger.hover();
      log('  ✓ "프로그램" hover 완료');

      const allProgramsLink = page
        .getByRole('link', { name: /전체\s*프로그램/i })
        .first();
      // hover 로 드롭다운이 열렸는지 확인. 안 열렸으면 click 으로 fallback.
      if (!(await allProgramsLink.isVisible().catch(() => false))) {
        log('  → hover 로 안 열려 click 으로 fallback');
        await programsTrigger.click({ trial: false }).catch(() => undefined);
      }
      await expect(
        allProgramsLink,
        '드롭다운에 "전체 프로그램" 링크가 보여야 한다',
      ).toBeVisible({ timeout: 5_000 });
      // 드롭다운 링크 위로 마우스 이동 → hover state 유지하며 자연스럽게 클릭.
      // 이 단계가 없으면 Playwright 의 다른 처리 중 마우스가 트리거에서 떠나
      // 드롭다운이 닫혀 viewport 밖으로 사라짐 (transform translateY 패턴).
      await allProgramsLink.hover();
      log('  → "전체 프로그램" 클릭');
      try {
        await allProgramsLink.click({ timeout: 5_000 });
      } catch {
        // 그래도 viewport 밖이면 force 로 강제 클릭 (네비게이션 자체는 동작).
        log('  ↻ viewport 밖이라 force click 으로 재시도');
        await allProgramsLink.click({ force: true });
      }
      log(`  ✓ 전체 프로그램 페이지 이동 완료 (url=${page.url()})`);
    });

    // ────────────────────────────────────────────────────────────
    // 3) 프로그램 목록에서 테스트 챌린지 클릭
    // ────────────────────────────────────────────────────────────
    await test.step(`3. 목록에서 "${TEST_CHALLENGE_TITLE}" 클릭`, async () => {
      await page.waitForLoadState('domcontentloaded');
      log(`  → 목록에서 "${TEST_CHALLENGE_TITLE}" 검색`);
      const challengeLink = page
        .getByRole('link', { name: new RegExp(TEST_CHALLENGE_TITLE, 'i') })
        .first();
      await expect(
        challengeLink,
        `전체 프로그램 목록에 "${TEST_CHALLENGE_TITLE}" 챌린지가 보여야 한다`,
      ).toBeVisible({ timeout: 15_000 });
      log('  ✓ 챌린지 카드 발견');
      await challengeLink.click();
      log('  → 상세 redirect 대기 ([id] → [id]/[slug])');
      await page.waitForURL(/\/program\/challenge\/[^/]+\/[^/]+/, {
        timeout: 15_000,
      });
      await expect(page).toHaveTitle(new RegExp(TEST_CHALLENGE_TITLE, 'i'), {
        timeout: 10_000,
      });
      log(`  ✓ 챌린지 상세 진입 완료 (url=${page.url()})`);
    });

    // ────────────────────────────────────────────────────────────
    // 4) "바로 신청"
    // ────────────────────────────────────────────────────────────
    await test.step('4. "바로 신청" 클릭', async () => {
      log('  → 이미 신청 상태 감지');
      const alreadyEnrolled = await page
        .getByRole('button', {
          name: /시작하기|내\s*라이브러리|이미\s*신청|수강\s*중/i,
        })
        .first()
        .isVisible()
        .catch(() => false);

      if (alreadyEnrolled) {
        log(
          '  ⚠ 이미 신청한 상태 감지 — test.skip. BE 에서 봇 신청 이력 리셋 필요.',
        );
      }
      test.skip(
        alreadyEnrolled,
        '봇 계정이 이미 해당 챌린지에 신청한 상태입니다. ' +
          'BE 에서 봇의 신청 이력을 리셋한 뒤 재실행하세요.',
      );

      const applyNowButton = page
        .getByRole('button', { name: /바로\s*신청/i })
        .first();
      await expect(
        applyNowButton,
        '"바로 신청" 버튼이 보여야 한다',
      ).toBeVisible({ timeout: 10_000 });
      log('  ✓ "바로 신청" 버튼 노출');
      await applyNowButton.click();
      log('  ✓ "바로 신청" 클릭 완료');
    });

    // ────────────────────────────────────────────────────────────
    // 5) "신청하기"
    // ────────────────────────────────────────────────────────────
    await test.step('5. "신청하기" 클릭', async () => {
      const enrollButton = page
        .getByRole('button', { name: /^신청하기$/ })
        .first();
      await expect(enrollButton, '"신청하기" 버튼이 보여야 한다').toBeVisible({
        timeout: 10_000,
      });
      log('  ✓ "신청하기" 버튼 노출');
      await enrollButton.click();
      log('  ✓ "신청하기" 클릭 완료');
    });

    // ────────────────────────────────────────────────────────────
    // 6) "0원 결제하기" — 라벨이 가격 안전 가드 역할
    // ────────────────────────────────────────────────────────────
    await test.step('6. "0원 결제하기" 클릭', async () => {
      const payZeroButton = page
        .getByRole('button', { name: /0\s*원\s*결제/i })
        .first();
      await expect(
        payZeroButton,
        '"0원 결제하기" 버튼이 보여야 한다 (안전 가드: 무료 옵션 확인)',
      ).toBeVisible({ timeout: 10_000 });
      log('  ✓ "0원 결제하기" 버튼 노출 — 무료 옵션 확인');
      await payZeroButton.click();
      log('  ✓ "0원 결제하기" 클릭 완료');
    });

    // ────────────────────────────────────────────────────────────
    // 7) 결제 결과 검증
    // ────────────────────────────────────────────────────────────
    await test.step('7. 결제 결과 페이지 도달 검증', async () => {
      log('  → /order/result 또는 /library 도달 대기');
      await page.waitForURL(/\/order\/result|\/library/, { timeout: 30_000 });
      log(`  ✓ 결과 페이지 도달 (url=${page.url()})`);
      await expect(
        page
          .getByText(/결제\s*완료|주문\s*완료|신청\s*완료|성공/i)
          .or(page.getByText(/내\s*라이브러리|학습\s*시작/i))
          .first(),
        '결제 결과 또는 라이브러리 페이지에 성공 안내가 표시되어야 한다',
      ).toBeVisible({ timeout: 15_000 });
      log('  ✓ 성공 안내 노출 확인');
    });

    log('✓ 시나리오 종료 — 결제 플로우 정상');
  });
});
