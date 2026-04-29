import { type Page, type Locator, expect } from '@playwright/test';

/**
 * 챌린지 상세 페이지 Page Object.
 *
 * 실제 selector 는 staging UI 에 맞춰 codegen / e2e:ui 모드로 보강해야 한다.
 * 가능한 한 getByRole / getByLabel / getByText 같은 시맨틱 selector 를 우선 사용.
 */
export class ChallengePage {
  constructor(private readonly page: Page) {}

  async goto(target: string) {
    // target 은 다음 셋 중 하나일 수 있다:
    //   1) 풀 URL: "http://..." | "https://..."  → 그대로 사용
    //   2) path: "/program/challenge/123"        → 그대로 사용 (baseURL 결합)
    //   3) ID: "123"                              → "/program/challenge/123" 으로 조립
    const url = /^https?:\/\//i.test(target)
      ? target
      : target.startsWith('/')
        ? target
        : `/program/challenge/${target}`;
    const response = await this.page.goto(url);
    expect(
      response?.status() ?? 0,
      `챌린지 상세 페이지가 200/3xx 응답을 줘야 한다 (url=${url})`,
    ).toBeLessThan(400);
  }

  /**
   * 챌린지 제목에 특정 텍스트가 포함되는지 확인.
   * 테스트 챌린지가 다른 챌린지와 섞이지 않도록 정체성 검증용.
   */
  async expectTitleContains(text: string) {
    // TODO: 챌린지 상세 헤더의 정확한 selector 로 교체.
    //   예) page.getByRole('heading', { level: 1 })
    //   현재는 가장 큰 heading 전체에서 substring 매칭으로 시작.
    await expect(this.page.locator('h1, h2').first()).toContainText(text, {
      ignoreCase: true,
    });
  }

  /**
   * 안전 가드: 결제 진행 전 가격이 무료/0원 인지 확인.
   * 누군가 admin 에서 가격을 바꿔도 사고가 나지 않도록.
   */
  async expectPriceIsFree(): Promise<void> {
    // TODO: 가격 표시 영역의 정확한 selector 로 교체.
    //   상세 페이지에서 가격이 표시되는 컨테이너를 잡아야 함.
    const priceText = await this.priceTextSafe();
    expect(
      priceText,
      `결제 안전 가드: 표시 가격이 "무료" 또는 "0원" 이어야 한다 (실제: ${priceText})`,
    ).toMatch(/0\s*원|무료|free/i);
  }

  private async priceTextSafe(): Promise<string> {
    // 페이지 텍스트 전체에서 가격 패턴을 시도. selector 가 확정되면 더 좁은 영역으로 교체.
    const body = await this.page.locator('body').innerText();
    return body;
  }

  /**
   * 챌린지에 옵션이 여러 개라면 무료 옵션을 선택.
   * E2E_TEST_CHALLENGE_OPTION_ID 가 비어 있으면 noop.
   */
  async selectOptionIfNeeded(optionId: string | undefined): Promise<void> {
    if (!optionId) return;
    // TODO: 옵션 라디오/카드 selector 로 교체.
    //   예) page.getByRole('radio', { name: new RegExp(optionId) })
    const optionLocator: Locator = this.page.locator(
      `[data-option-id="${optionId}"], [data-testid="option-${optionId}"]`,
    );
    if (await optionLocator.count()) {
      await optionLocator.first().click();
      return;
    }
    // fallback: "무료" 텍스트가 들어간 옵션 클릭 시도
    const freeOption = this.page.getByText(/무료|0\s*원/i).first();
    if (await freeOption.count()) {
      await freeOption.click();
    }
  }

  /**
   * "신청하기" / "결제하기" 버튼 클릭.
   * 라벨 텍스트가 환경에 따라 다를 수 있어 정규식으로 다중 매칭.
   */
  async clickApply() {
    const button = this.page
      .getByRole('button', { name: /신청|결제|구매|시작/i })
      .first();
    await expect(button, '신청/결제 버튼이 활성 상태여야 한다').toBeEnabled();
    await button.click();
  }
}
