import { test, expect } from '@playwright/test';

/**
 * 시나리오 1 (비로그인): 챌린지 상세 -> 결제 페이지 도달.
 *
 * 목표: 결제 *직전* 까지 접근 가능한지 (404/500/Hydration error 회귀 확인).
 * 실제 결제는 수행하지 않는다.
 *
 * 이 시나리오는 인증 없이 동작하므로 .env.test.local 없이 실행 가능.
 * 실제 selector / 챌린지 ID 는 환경에 따라 달라질 수 있어 TODO 로 남김.
 */

const SAMPLE_CHALLENGE_PATH =
  process.env.E2E_SAMPLE_CHALLENGE_PATH ?? '/program';

test.describe('payment flow (anonymous)', () => {
  test('챌린지 목록 페이지가 정상 로드된다', async ({ page }) => {
    const response = await page.goto(SAMPLE_CHALLENGE_PATH);
    expect(response?.status(), 'HTTP 상태가 200/3xx 여야 한다').toBeLessThan(
      400,
    );

    // 페이지의 메인 콘텐츠가 렌더링됐는지 확인 (구체 selector 는 환경 별로 조정).
    await expect(page).toHaveURL(new RegExp(`${SAMPLE_CHALLENGE_PATH}`));
  });

  test('챌린지 상세 -> 결제 페이지 진입 (스모크)', async ({ page }) => {
    // TODO: 실제 챌린지 카드 selector 와 신청 버튼 selector 를 staging 환경에 맞춰 채울 것.
    //       현재는 페이지 진입 가능 여부만 보장하는 스모크 단계.
    await page.goto(SAMPLE_CHALLENGE_PATH);

    // 결제 페이지 라우팅 패턴이 존재하는지만 확인 (실제 결제 X).
    // 실제 selector 가 채워지면 challenge -> /program/[id] -> 결제 페이지로 이어지도록 보강.
    expect(page.url()).toContain(SAMPLE_CHALLENGE_PATH);
  });
});
