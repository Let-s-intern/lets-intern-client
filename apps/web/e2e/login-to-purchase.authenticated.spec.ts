import { test, expect } from '@playwright/test';
import { ChallengePage } from './helpers/challengePage';
import { PaymentInputPage } from './helpers/paymentInputPage';

/**
 * 시나리오: 로그인 → 챌린지 구매 (무료 옵션 종단 검증)
 *
 * 대상: staging 의 테스트 전용 챌린지 "E2E_TEST-login_to_purchase"
 *   - E2E_TEST_CHALLENGE_ID 또는 E2E_TEST_CHALLENGE_PATH 로 식별
 *   - 무료 옵션이 있어 실 결제 사고 위험 없음
 *
 * 안전 가드:
 *   - 진입 후 가격 표시가 "무료" 또는 "0원" 이어야만 결제 진행
 *   - 매칭 안 되면 fail (admin 에서 가격이 바뀐 사고 방지)
 *
 * 의존:
 *   - globalSetup 이 storageState 를 만들었어야 함 (E2E_TEST_USER_EMAIL/PW 필요)
 *   - 인증 정보가 없으면 자동 skip
 */

const credentials = {
  email: process.env.E2E_TEST_USER_EMAIL ?? '',
  password: process.env.E2E_TEST_USER_PW ?? '',
};

const target = {
  challengeId: process.env.E2E_TEST_CHALLENGE_ID ?? '',
  challengePath: process.env.E2E_TEST_CHALLENGE_PATH ?? '',
  optionId: process.env.E2E_TEST_CHALLENGE_OPTION_ID ?? '',
  expectedTitleSubstring: 'E2E_TEST-login_to_purchase',
};

const purchaser = {
  name: process.env.E2E_TEST_PURCHASER_NAME || 'E2E봇',
  phone: process.env.E2E_TEST_PURCHASER_PHONE || '01000000000',
  email:
    process.env.E2E_TEST_PURCHASER_EMAIL ||
    process.env.E2E_TEST_USER_EMAIL ||
    '',
};

const hasCredentials = Boolean(credentials.email && credentials.password);
const hasChallengeTarget = Boolean(target.challengeId || target.challengePath);

test.describe('login → purchase (free option)', () => {
  test.skip(
    !hasCredentials,
    'E2E_TEST_USER_EMAIL/PW 가 비어 있어 로그인 시나리오를 skip 합니다.',
  );
  test.skip(
    !hasChallengeTarget,
    'E2E_TEST_CHALLENGE_ID 또는 E2E_TEST_CHALLENGE_PATH 가 비어 있어 챌린지 구매 시나리오를 skip 합니다.',
  );

  test('인증된 사용자가 무료 옵션 챌린지를 결제 완료까지 진행한다', async ({
    page,
  }) => {
    // 1) 챌린지 상세 진입
    const detail = new ChallengePage(page);
    const target1 = target.challengePath || target.challengeId;
    await detail.goto(target1);
    await detail.expectTitleContains(target.expectedTitleSubstring);

    // 2) 이미 신청 완료 상태면 결제 플로우 재현 불가 → skip
    test.skip(
      await detail.isAlreadyEnrolled(),
      '봇 계정이 이미 해당 챌린지에 신청한 상태입니다. ' +
        'BE 에서 봇의 신청 이력을 리셋한 뒤 재실행하세요.',
    );

    // 3) 안전 가드 — 가격이 무료/0원 인지 확인 (실 결제 사고 방지)
    await detail.expectPriceIsFree();

    // 4) (선택) 옵션 선택
    await detail.selectOptionIfNeeded(target.optionId);

    // 5) 신청/결제 버튼 클릭 → /payment-input 로 이동
    await detail.clickApply();

    const payment = new PaymentInputPage(page);
    await payment.waitForLoaded();

    // 5) 주문자 정보 + 약관 동의
    await payment.fillPurchaser(purchaser);
    await payment.acceptRequiredAgreements();
    await payment.expectPayButtonEnabled();

    // 6) 결제 버튼 클릭
    //    - BE 가 0원 결제를 PG 우회 처리하면 즉시 /order/result 로 이동
    //    - PG 를 거치는 분기라면 외부 페이지 잠깐 끼어듦 (timeout 넉넉히)
    await payment.clickPay();

    // 7) 결제 결과 페이지 도달 + 성공 표시 확인
    await page.waitForURL(/\/order\/result/, { timeout: 60_000 });
    await expect(
      page.getByText(/결제\s*완료|주문\s*완료|신청\s*완료|성공/i).first(),
      '결제 결과 페이지에 성공 안내가 표시되어야 한다',
    ).toBeVisible({ timeout: 15_000 });
  });
});
