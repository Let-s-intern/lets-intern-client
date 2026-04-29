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

/**
 * 단계별 settle 대기시간(ms).
 * 각 페이지/액션의 BE fetch + React state 반영 특성에 맞춰 다르게 조정.
 * 너무 짧으면 default state 오감지 (예: 챌린지 상세의 "출시알림신청" 잠시 노출),
 * 너무 길면 spec 전체 시간 증가. 환경 변동성 큰 단계는 더 넉넉히.
 */
const WAITS = {
  /** 홈 진입 후 — 정적 페이지라 짧게. */
  home: 800,
  /** 로그인 완료 후 — 인증 쿠키 반영 + 리다이렉트 안정화. */
  afterLogin: 1500,
  /** /program 진입 후 — 카드 lazy load 어느 정도 확보. */
  programList: 1500,
  /** 챌린지 상세 진입 후 — BE challenge data fetch + 상태 분기 반영 충분히 대기. */
  challengeDetail: 3000,
  /** 신청 CTA 클릭 후 — 모달/결제 입력 화면 전환. */
  afterApply: 1500,
  /** (모달) "신청하기" 클릭 후. */
  afterModalEnroll: 1000,
  /** "0원 결제하기" 클릭 후 → 결과 페이지 도달. */
  afterPayZero: 1500,
};

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
      () => new HomePage(page).goto(WAITS.home),
      '홈',
    );

    // 2) 로그인 — 404 감지 시 자동 복구 (LoginPage 내부 로직)
    home = await flow.run(
      '2. 로그인 (홈 → /login → 인증 → 복귀, 404 시 자동 복구)',
      async () => {
        const loginPage = await home.clickLogin();
        return loginPage.loginWith(
          credentials.email,
          credentials.password,
          WAITS.afterLogin,
        );
      },
      '로그인_완료',
    );

    // 3) 프로그램 드롭다운 → /program
    let list: ProgramListPage = await flow.run(
      '3. 프로그램 드롭다운 → /program',
      async () => {
        await home.openProgramsDropdown();
        await runDir.snap(page, 99, '드롭다운_visual_only');
        return home.gotoAllPrograms(WAITS.programList);
      },
      '전체프로그램_목록',
    );

    // 4) 첫 N 개 카드를 차례로 시도해 가용한 챌린지 발견
    const availableDetail = await flow.run(
      `4. 첫 ${MAX_ATTEMPTS}개 챌린지 카드 순회 (가용한 첫 카드 선택)`,
      async () => {
        const total = await list.getChallengeCount();
        await runDir.snap(page, 30, '카운트직후_목록');
        log(`  총 챌린지 카드 수: ${total}개`);
        const limit = Math.min(MAX_ATTEMPTS, total);

        if (limit === 0) {
          await runDir.snap(page, 31, '카드0개_진단용');
          test.skip(
            true,
            '/program 에 챌린지 카드가 0개. ' +
              'admin 에서 챌린지 노출 상태를 확인하거나 ' +
              '필터(상단 탭/사이드바) 가 적용 중인지 확인하세요. ' +
              '30-카운트직후_목록.png / 31-카드0개_진단용.png 참고.',
          );
          throw new Error('unreachable');
        }

        for (let i = 0; i < limit; i += 1) {
          log(`  ── 시도 ${i + 1}/${limit} ──`);
          const detail = await list.openChallengeByIndex(
            i,
            WAITS.challengeDetail,
          );
          await runDir.snap(page, 40 + i * 4, `시도${i + 1}_상세_진입`);
          const status = await detail.checkStatus();
          await runDir.snap(page, 41 + i * 4, `시도${i + 1}_상태_${status}`);
          log(`    status=${status} (url=${page.url()})`);

          if (status === 'available') {
            log(`  ✓ 가용 챌린지 발견 — ${i + 1}번째 진행`);
            return detail;
          }

          if (i < limit - 1) {
            log('  → 다음 카드 시도 위해 /program 복귀');
            list = await list.goto(WAITS.programList);
            await runDir.snap(page, 42 + i * 4, `시도${i + 1}_복귀_목록`);
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

    // 5) 신청 → 0원 결제 — 단계마다 캡처
    const result = await flow.run(
      '5. 지금 바로 신청 → (모달) 신청하기 → 0원 결제하기',
      async () => {
        await availableDetail.clickApply(WAITS.afterApply);
        await runDir.snap(page, 50, '5a_지금바로신청_클릭후');

        const payment = new PaymentInputPage(page);
        await payment.clickEnrollIfPresent(WAITS.afterModalEnroll);
        await runDir.snap(page, 51, '5b_모달_신청하기_클릭후');

        const orderResult = await payment.clickPayZero(WAITS.afterPayZero);
        await runDir.snap(page, 52, '5c_0원결제_클릭후');
        return orderResult;
      },
      '0원결제_완료_정리',
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
