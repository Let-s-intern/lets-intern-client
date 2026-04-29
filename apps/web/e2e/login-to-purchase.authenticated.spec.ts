import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
 * 산출물 디렉토리 구조:
 *   apps/web/test-results/e2e-screenshots/
 *     success/<YYYYMMDD-HHMMSS>/   — 성공 실행 (스텝 PNG + meta.txt)
 *     failure/<YYYYMMDD-HHMMSS>/   — 실패 실행 (PNG + 99-실패시점.png + error.txt)
 *     skipped/<YYYYMMDD-HHMMSS>/   — skip 된 실행 (PNG + meta.txt)
 *     _pending/<YYYYMMDD-HHMMSS>/  — 실행 중 (afterEach 에서 위 셋 중 하나로 이동)
 */

const TEST_CHALLENGE_TITLE = 'E2E_TEST-login_to_purchase';
const RESULTS_ROOT = path.resolve(
  __dirname,
  '..',
  'test-results',
  'e2e-screenshots',
);

/** 실행 시작 시점 타임스탬프 (모듈 로드 시 1회 고정). */
const RUN_TIMESTAMP = formatTimestamp(new Date());
const PENDING_DIR = path.join(RESULTS_ROOT, '_pending', RUN_TIMESTAMP);

const hasCredentials = Boolean(
  process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PW,
);

function formatTimestamp(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

/** 터미널에 보기 좋게 진행 로그 출력. */
function log(message: string) {
  const ts = new Date().toISOString().slice(11, 19);
  // eslint-disable-next-line no-console
  console.log(`[E2E ${ts}] ${message}`);
}

/** 이번 실행을 위한 _pending 디렉토리 준비. 이전 _pending 실패 잔재도 정리. */
function preparePendingDir() {
  // 모듈 단위로 _pending/<TIMESTAMP> 가 존재할 가능성 (재실행). 정리.
  if (fs.existsSync(PENDING_DIR)) {
    fs.rmSync(PENDING_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(PENDING_DIR, { recursive: true });
}

/** 단계별 스크린샷 저장. fullPage=true 로 전체 화면 캡처. */
async function snap(page: Page, seq: number, name: string) {
  // 스크롤 위치를 최상단으로 강제 — 헤더가 항상 PNG 상단에 보이도록.
  // (fullPage 라도 sticky/fixed 헤더가 viewport 마지막 위치에서만 합성되는
  //  Playwright 동작을 보정.)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150); // sticky/transition 안정화 대기
  const safeName = name.replace(/[^\w가-힣\-]/g, '_');
  const filename = `${String(seq).padStart(2, '0')}-${safeName}.png`;
  const filepath = path.join(PENDING_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  log(`  📸 ${filename}`);
}

/** 메타 파일 작성. */
function writeMeta(content: string) {
  fs.writeFileSync(path.join(PENDING_DIR, 'meta.txt'), content, 'utf8');
}

/** _pending 디렉토리를 status 폴더로 이동 (success/failure/skipped). */
function finalizeRunDir(status: 'success' | 'failure' | 'skipped') {
  const targetParent = path.join(RESULTS_ROOT, status);
  fs.mkdirSync(targetParent, { recursive: true });
  const target = path.join(targetParent, RUN_TIMESTAMP);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.renameSync(PENDING_DIR, target);
  return target;
}

test.describe('login → purchase (free option)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );

  test('홈 → 전체 프로그램 → 테스트 챌린지 → 바로 신청 → 0원 결제', async ({
    page,
  }) => {
    preparePendingDir();
    log('▶ 시나리오 시작');
    log(`  실행 ID: ${RUN_TIMESTAMP}`);
    log(`  진행 중 산출물: ${PENDING_DIR}`);

    // ────────────────────────────────────────────────────────────
    // 1) 렛츠커리어 홈
    // ────────────────────────────────────────────────────────────
    await test.step('1. 홈 진입', async () => {
      log('  → 홈 진입 시도');
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      log(`  ✓ 홈 진입 성공 (url=${page.url()})`);
      await snap(page, 1, '홈');
    });

    // ────────────────────────────────────────────────────────────
    // 2) 상단 "프로그램" 드롭다운 → "전체 프로그램"
    // ────────────────────────────────────────────────────────────
    await test.step('2. 프로그램 드롭다운 → 전체 프로그램', async () => {
      // hover 로 드롭다운 열린 시각 확인은 스크린샷에 기록.
      // 단, "전체 프로그램" 링크 클릭은 모바일 메뉴 안의 동명 링크가 viewport 밖에
      // 잡혀 충돌하는 사례가 있어, 실제 이동은 page.goto('/program') 으로 우회.
      log('  → "프로그램" 카테고리 hover 시도 (드롭다운 열림 확인용)');
      const programsTrigger = page
        .getByRole('button', { name: /^프로그램$/ })
        .or(page.getByRole('link', { name: /^프로그램$/ }))
        .first();
      if (await programsTrigger.isVisible().catch(() => false)) {
        await programsTrigger.hover().catch(() => undefined);
        log('  ✓ "프로그램" hover 완료');
      } else {
        log('  ⚠ 데스크톱 nav 의 "프로그램" 트리거를 못 찾음 — hover skip');
      }
      await snap(page, 2, '드롭다운_열림');

      log('  → /program 으로 직접 이동 (모바일/데스크톱 충돌 회피)');
      await page.goto('/program');
      await page.waitForLoadState('domcontentloaded');
      log(`  ✓ 전체 프로그램 페이지 이동 완료 (url=${page.url()})`);
      await snap(page, 3, '전체프로그램_목록');
    });

    // ────────────────────────────────────────────────────────────
    // 3) 프로그램 목록에서 테스트 챌린지 클릭
    // ────────────────────────────────────────────────────────────
    await test.step(`3. 목록에서 "${TEST_CHALLENGE_TITLE}" 클릭`, async () => {
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
      await snap(page, 4, '챌린지_상세');
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
        await snap(page, 5, '이미신청_상태');
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
      await snap(page, 5, '바로신청_클릭후');
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
      await snap(page, 6, '신청하기_클릭후');
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
      await snap(page, 7, '0원결제_버튼노출');
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
      await snap(page, 8, '결제완료');
    });

    log('✓ 시나리오 종료 — 결제 플로우 정상');
  });

  /**
   * 실행 종료 처리:
   *   - 실패 시 마지막 화면 캡처 + error.txt 작성
   *   - meta.txt 작성 후 _pending 을 success/failure/skipped 로 이동
   */
  test.afterEach(async ({ page }, testInfo) => {
    // 1) 실패 시 마지막 화면 + 에러 메모
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      try {
        const failureFile = path.join(PENDING_DIR, '99-실패시점.png');
        await page.screenshot({ path: failureFile, fullPage: true });
        log(`📸 실패 시점 캡처: ${failureFile}`);
      } catch {
        /* page 가 닫혔으면 무시 */
      }
      const errorMessage = testInfo.error?.message ?? '(no error message)';
      const errorStack = testInfo.error?.stack ?? '';
      fs.writeFileSync(
        path.join(PENDING_DIR, 'error.txt'),
        `${errorMessage}\n\n${errorStack}\n`,
        'utf8',
      );
    }

    // 2) meta.txt
    const finalUrl = page.url();
    const durationMs = testInfo.duration;
    writeMeta(
      [
        `Test:       ${testInfo.title}`,
        `Status:     ${testInfo.status}`,
        `Expected:   ${testInfo.expectedStatus}`,
        `Run ID:     ${RUN_TIMESTAMP}`,
        `Duration:   ${durationMs} ms`,
        `Final URL:  ${finalUrl}`,
        `Base URL:   ${process.env.PLAYWRIGHT_BASE_URL ?? '(default)'}`,
        `Challenge:  ${TEST_CHALLENGE_TITLE}`,
      ].join('\n') + '\n',
    );

    // 3) status 별 폴더로 이동
    const status: 'success' | 'failure' | 'skipped' =
      testInfo.status === 'passed'
        ? 'success'
        : testInfo.status === 'skipped'
          ? 'skipped'
          : 'failure';
    try {
      const finalDir = finalizeRunDir(status);
      log(`📁 결과 저장: ${finalDir}`);
    } catch (err) {
      log(`⚠ 결과 폴더 이동 실패: ${(err as Error).message}`);
    }
  });
});
