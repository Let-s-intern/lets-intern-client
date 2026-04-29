import { test } from '@playwright/test';
import { Pipeline } from './helpers/pipeline';
import { RunDir } from './helpers/runDir';
import { log } from './helpers/log';
import { HomePage } from './pages/HomePage';
import { PaymentInputPage } from './pages/PaymentInputPage';

/**
 * 시나리오: 메인 → 로그인 → 챌린지 검색 → 신청 → 0원 결제 (POM + Pipeline)
 *
 * 흐름:
 *   1) 홈 진입
 *   2) 로그인 버튼 클릭 → /login 진입 → 자격 증명 입력 → 로그인 → 홈 복귀
 *   3) "프로그램" 드롭다운 hover 후 /program 으로 이동
 *   4) 목록에서 E2E_TEST-login_to_purchase 챌린지 클릭 → 상세 진입
 *   5) 신청 가능성 검사 → 종료/이미신청이면 test.skip
 *   6) "지금 바로 신청" → (모달이면) "신청하기" → "0원 결제하기"
 *   7) 결제 결과 페이지 도달 + 성공 안내 검증
 *
 * 산출물:
 *   apps/web/test-results/e2e-screenshots/<status>/<timestamp>/
 *     단계별 PNG + meta.txt (+실패 시 99-실패시점.png + error.txt)
 */

const TEST_CHALLENGE_TITLE = 'E2E_TEST-login_to_purchase';

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

  test('홈 → 로그인 → 전체 프로그램 → 테스트 챌린지 → 0원 결제', async ({
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
    const programList = await flow.run(
      '3. 프로그램 드롭다운 → /program',
      async () => {
        await home.openProgramsDropdown();
        await runDir.snap(page, 99, '드롭다운_열림_visual_only'); // visual 증거만 — seq 는 별도로 안 차감
        return home.gotoAllPrograms();
      },
      '전체프로그램_목록',
    );

    // 4) 챌린지 카드 클릭 → 상세
    const detail = await flow.run(
      `4. 목록에서 "${TEST_CHALLENGE_TITLE}" 클릭`,
      () => programList.openChallengeByTitle(TEST_CHALLENGE_TITLE),
      '챌린지_상세',
    );

    // 5) 상태 검사 — closed/enrolled 면 skip
    await flow.run('5. 신청 가능성 검사', async () => {
      const status = await detail.checkStatus();
      log(`    상태: ${status}`);
      if (status !== 'available') {
        await runDir.snap(page, 98, `상태_${status}`);
      }
      test.skip(
        status === 'closed',
        '프로그램이 종료된(또는 시작 전) 상태입니다 (출시알림신청 노출). 새 회차 오픈 후 재실행하세요.',
      );
      test.skip(
        status === 'enrolled',
        '봇 계정이 이미 해당 챌린지에 신청한 상태입니다. BE 에서 봇의 신청 이력을 리셋한 뒤 재실행하세요.',
      );
      test.skip(
        status === 'unknown',
        '챌린지 상세에서 신청/종료/신청완료 어느 상태도 감지하지 못했습니다. UI 변경 가능성 — 셀렉터 검토 필요.',
      );
    });

    // 6) 신청 → 0원 결제
    const result = await flow.run(
      '6. 지금 바로 신청 → (모달) 신청하기 → 0원 결제하기',
      async () => {
        await detail.clickApply();
        const payment = new PaymentInputPage(page);
        await payment.clickEnrollIfPresent();
        return payment.clickPayZero();
      },
      '0원결제_완료',
    );

    // 7) 결과 검증
    await flow.run(
      '7. 결제 결과 검증',
      () => result.expectSuccess(),
      '결제완료',
    );

    log('✓ 시나리오 종료 — 결제 플로우 정상');
  });

  test.afterEach(async ({ page }, testInfo) => {
    await runDir.finalize(page, testInfo, TEST_CHALLENGE_TITLE);
  });
});
