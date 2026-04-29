import { test } from '@playwright/test';
import { Pipeline } from './helpers/pipeline';
import { RunDir } from './helpers/runDir';
import { log } from './helpers/log';
import { HomePage } from './pages/HomePage';
import { PaymentInputPage } from './pages/PaymentInputPage';
import type { ProgramListPage } from './pages/ProgramListPage';

/**
 * 시나리오: 로그인 → 전체 프로그램 → 첫 가용 챌린지 → 0원 결제
 *
 * 흐름:
 *   1) 홈 진입
 *   2) 로그인 (홈 → /login → 인증 → 복귀)
 *   3) "프로그램" 드롭다운 hover → /program 으로 이동
 *   4) 첫 3개 챌린지 카드를 차례로 시도:
 *        - 카드 클릭 → 상세 진입 → 충분히 대기 (settle 3000ms)
 *        - status === 'available' 이면 결제 플로우 진행
 *        - 아니면 /program 복귀 후 다음 카드 시도
 *      3개 모두 불가하면 test.skip.
 *   5) "지금 바로 신청" → (모달이면) "신청하기" → "0원 결제하기"
 *   6) 결과 페이지 도달 + 성공 안내 검증
 *
 * 환경변수 의존 제거: 특정 챌린지 ID/PATH 설정 없이도 동작.
 */

const MAX_ATTEMPTS = 3;

const credentials = {
  email: process.env.E2E_TEST_USER_EMAIL ?? '',
  password: process.env.E2E_TEST_USER_PW ?? '',
};

const hasCredentials = Boolean(credentials.email && credentials.password);

test.describe('login → purchase (free option)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );

  const runDir = new RunDir();

  test('홈 → 로그인 → 전체 프로그램 → 첫 가용 챌린지 → 0원 결제', async ({
    page,
  }) => {
    runDir.prepare();
    log('▶ 시나리오 시작');
    log(`  실행 ID: ${runDir.timestamp}`);

    const flow = new Pipeline(page, runDir);

    // 1) 홈 진입
    let home = await flow.run(
      '1. 홈 진입',
      () => new HomePage(page).goto(),
      '홈',
    );

    // 2) 로그인
    home = await flow.run(
      '2. 로그인 (홈 → /login → 인증 → 복귀)',
      async () => {
        const loginPage = await home.clickLogin();
        return loginPage.loginWith(credentials.email, credentials.password);
      },
      '로그인_완료',
    );

    // 3) 프로그램 드롭다운 → /program
    let list: ProgramListPage = await flow.run(
      '3. 프로그램 드롭다운 → /program',
      async () => {
        await home.openProgramsDropdown();
        await runDir.snap(page, 99, '드롭다운_visual_only');
        return home.gotoAllPrograms();
      },
      '전체프로그램_목록',
    );

    // 4) 첫 N 개 카드를 차례로 시도해 가용한 챌린지 발견
    let availableDetail = await flow.run(
      `4. 첫 ${MAX_ATTEMPTS}개 챌린지 카드 순회 (가용한 첫 카드 선택)`,
      async () => {
        const total = await list.getChallengeCount();
        log(`  총 챌린지 카드 수: ${total}개`);
        const limit = Math.min(MAX_ATTEMPTS, total);

        for (let i = 0; i < limit; i += 1) {
          log(`  ── 시도 ${i + 1}/${limit} ──`);
          const detail = await list.openChallengeByIndex(i);
          await runDir.snap(page, 90 + i, `시도${i + 1}_상세`);
          const status = await detail.checkStatus();
          log(`    status=${status} (url=${page.url()})`);

          if (status === 'available') {
            log(`  ✓ 가용 챌린지 발견 — ${i + 1}번째 진행`);
            return detail;
          }

          if (i < limit - 1) {
            log('  → 다음 카드 시도 위해 /program 복귀');
            list = await list.goto();
          }
        }

        log(`  ⚠ 첫 ${limit}개 카드 모두 신청 불가 — test.skip`);
        test.skip(
          true,
          `첫 ${limit}개 챌린지 모두 신청 불가 (closed/enrolled/unknown). ` +
            'admin 에서 결제 가능한 챌린지를 상단에 노출하거나 ' +
            '봇 신청 이력을 리셋한 뒤 재실행하세요.',
        );
        // unreachable — test.skip 이 throw
        throw new Error('unreachable');
      },
    );

    // 5) 신청 → 0원 결제
    const result = await flow.run(
      '5. 지금 바로 신청 → (모달) 신청하기 → 0원 결제하기',
      async () => {
        await availableDetail.clickApply();
        const payment = new PaymentInputPage(page);
        await payment.clickEnrollIfPresent();
        return payment.clickPayZero();
      },
      '0원결제_완료',
    );

    // 6) 결과 검증
    await flow.run(
      '6. 결제 결과 검증',
      () => result.expectSuccess(),
      '결제완료',
    );

    log('✓ 시나리오 종료 — 결제 플로우 정상');
  });

  test.afterEach(async ({ page }, testInfo) => {
    await runDir.finalize(page, testInfo, '(전체 프로그램 첫 가용 카드)');
  });
});
