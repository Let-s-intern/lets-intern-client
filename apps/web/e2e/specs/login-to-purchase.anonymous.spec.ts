import { test } from '@playwright/test';
import { Pipeline } from '../support/pipeline';
import { RunDir } from '../support/runDir';
import { log } from '../support/log';
import { PaymentInputPage } from '../pages/PaymentInputPage';
import type { ProgramListPage } from '../pages/ProgramListPage';
import { loginFlow } from '../flows/LoginFlow';

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
 * 단계별 추가 정적 대기(ms) — 보조 buffer.
 *
 * 각 POM 메서드는 동적 anchor 대기(특정 element visible 될 때까지)를 기본 사용.
 * 즉 화면 준비되면 즉시 진행하고, 여기 값들은 anchor 가 떠도 더 기다릴 보조 시간.
 * 보통 0 또는 매우 짧게 — anchor 가 충분하므로.
 */
const WAITS = {
  /** 홈 진입 후 — anchor (헤더/로고) 시각화 후 추가 대기. */
  home: 0,
  /** 로그인 완료 후 — 인증 쿠키 반영. */
  afterLogin: 500,
  /** /program 진입 후 — 카드 첫 visible 후 추가 대기. */
  programList: 0,
  /** 챌린지 상세 진입 후 — anchor (apply_button/early_button) 후 추가 대기. */
  challengeDetail: 0,
  /** 신청 CTA 클릭 후 — 모달/결제 화면 전환 buffer. */
  afterApply: 500,
  /** (모달) "신청하기" 클릭 후 — 모달 → 결제 화면 전환. */
  afterModalEnroll: 300,
  /** "0원 결제하기" 클릭 후 → 결과 페이지. */
  afterPayZero: 500,
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

    // 1+2) 홈 → 로그인 (LoginFlow 로 묶음)
    const home = await flow.run(
      '1+2. 홈 진입 → /login → 인증 → 복귀',
      () =>
        loginFlow(page, {
          email: credentials.email,
          password: credentials.password,
          homeWait: WAITS.home,
          afterLoginWait: WAITS.afterLogin,
        }),
      '로그인_완료',
    );

    // 3) 프로그램 드롭다운 → /program
    let list: ProgramListPage = await flow.run(
      '3. 프로그램 드롭다운 → /program',
      async () => {
        await home.openProgramsDropdown();
        await runDir.snap(page, 20, '드롭다운_visual');
        return home.gotoAllPrograms(WAITS.programList);
      },
      '전체프로그램_목록',
    );

    // 4) 첫 N 개 카드를 차례로 시도해 가용한 챌린지 발견.
    //    카드는 type 정보가 DOM 에 없어 클릭 후 URL 로 챌린지 여부 판정.
    const availableDetail = await flow.run(
      `4. 첫 ${MAX_ATTEMPTS}개 카드 순회 → 챌린지 판정 + 가용성 검사`,
      async () => {
        const total = await list.getProgramCount();
        await runDir.snap(page, 30, '카운트직후_목록');
        log(`  총 프로그램 카드 수: ${total}개`);
        const limit = Math.min(MAX_ATTEMPTS, total);

        if (limit === 0) {
          await runDir.snap(page, 31, '카드0개_진단용');
          test.skip(
            true,
            '/program 에 프로그램 카드가 0개. ' +
              'admin 에서 프로그램 노출 상태를 확인하거나 ' +
              '필터(상단 탭/사이드바) 가 적용 중인지 확인하세요. ' +
              '30-카운트직후_목록.png / 31-카드0개_진단용.png 참고.',
          );
          throw new Error('unreachable');
        }

        for (let i = 0; i < limit; i += 1) {
          log(`  ── 시도 ${i + 1}/${limit} ──`);
          const detail = await list.openProgramByIndex(
            i,
            WAITS.challengeDetail,
          );
          await runDir.snap(page, 40 + i * 4, `시도${i + 1}_상세_진입`);

          if (detail === null) {
            // 챌린지가 아닌 프로그램 (live/guidebook/vod) — 다음 카드 시도
            log(`    챌린지 아닌 type → 다음`);
            if (i < limit - 1) {
              list = await list.goto(WAITS.programList);
              await runDir.snap(page, 42 + i * 4, `시도${i + 1}_복귀_목록`);
            }
            continue;
          }

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
          `첫 ${limit}개 카드 모두 신청 불가 (챌린지 아님 / closed / enrolled / unknown). ` +
            'admin 에서 결제 가능한 챌린지를 상단에 노출하거나 ' +
            '봇 신청 이력을 리셋한 뒤 재실행하세요.',
        );
        throw new Error('unreachable');
      },
    );

    // 5) 신청 → 0원 결제 — 단계마다 캡처
    const result = await flow.run(
      '5. 지금 바로 신청 → (모달) 신청하기 → 0원 결제하기',
      async () => {
        const applyResult = await availableDetail.clickApply(WAITS.afterApply);
        await runDir.snap(page, 50, '5a_지금바로신청_클릭후');

        // 클릭 후 "이미 신청 완료" 감지 시 즉시 skip (지금까지의 카드는 이미 신청됨).
        if (applyResult.alreadyEnrolled) {
          await runDir.snap(page, 95, '이미신청완료_감지');
          test.skip(
            true,
            '봇 계정이 해당 챌린지에 이미 신청된 상태입니다 (검사 통과 후 클릭 시점에 발견). ' +
              'BE 에서 봇의 신청 이력을 리셋한 뒤 재실행하세요.',
          );
          throw new Error('unreachable');
        }

        const payment = new PaymentInputPage(page);
        await payment.clickEnrollIfPresent(WAITS.afterModalEnroll);
        await runDir.snap(page, 51, '5b_모달_신청하기_클릭후');

        const orderResult = await payment.clickPayZero(WAITS.afterPayZero);
        await runDir.snap(page, 52, '5c_0원결제_클릭후');
        return orderResult;
      },
      '0원결제_완료_정리',
    );

    // 6) 결제 직후 결과 페이지 soft 검증 (성공 안내 메시지 있으면 OK, 없어도 진행)
    await flow.run(
      '6. 결제 결과 페이지 soft 검증',
      () => result.softCheckSuccess(),
      '결제결과_soft체크',
    );

    // 7) 마이페이지 이동 + 신청 프로그램 노출 검증 (최종 검증)
    await flow.run(
      '7. 마이페이지 이동 → 신청 결과 검증',
      async () => {
        const mypage = await result.goToMypage();
        await mypage.expectHasProgram();
        return mypage;
      },
      '마이페이지_신청확인',
    );

    log('✓ 시나리오 종료 — 결제 플로우 + 마이페이지 검증 정상');
  });

  test.afterEach(async ({ page }, testInfo) => {
    await runDir.finalize(page, testInfo, '(전체 프로그램 첫 가용 카드)');
  });
});
