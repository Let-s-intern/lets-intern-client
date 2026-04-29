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
   *
   * 검증 1: document title (Next metadata) — 가장 안정적.
   *         page.tsx 의 generateMetadata 가 challenge.title 을 그대로 사용.
   * 검증 2: URL slug — `/program/challenge/{id}/{slug}` 의 slug 부분.
   *         redirect 가 반영되었는지 동시에 확인.
   */
  async expectTitleContains(text: string) {
    // [id] → [id]/[title] 로 redirect 가 일어나므로 잠시 대기.
    await this.page.waitForURL(/\/program\/challenge\/[^/]+\/[^/]+/, {
      timeout: 15_000,
    });
    // 1) document title
    await expect(this.page).toHaveTitle(new RegExp(text, 'i'), {
      timeout: 10_000,
    });
    // 2) URL slug — title 을 lowercase + 공백/슬래시 -> '-' 로 변환한 형태가 들어가야 함.
    const expectedSlug = text.replace(/[ /]/g, '-').toLowerCase();
    expect(
      this.page.url().toLowerCase(),
      `URL 에 챌린지 slug "${expectedSlug}" 가 포함되어야 한다 (현재: ${this.page.url()})`,
    ).toContain(expectedSlug);
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
   * 이미 신청/구매 완료 상태인지 감지.
   * 챌린지 상세에 "시작하기" / "내 라이브러리" / "이미 신청" 같은 텍스트가
   * 보이면 봇 계정이 이전 실행에서 가입을 완료한 상태로 간주.
   *
   * 이 상태에서는 결제 플로우를 재현할 수 없으므로 spec 에서 skip 또는 fail
   * 처리하고, BE 측에서 봇의 신청 이력을 리셋한 뒤 재실행해야 한다.
   */
  async isAlreadyEnrolled(): Promise<boolean> {
    const enrolledIndicator = this.page
      .getByRole('button', { name: /시작하기|내\s*라이브러리|이미\s*신청/i })
      .or(this.page.getByText(/이미\s*신청|수강\s*중/i))
      .first();
    return (await enrolledIndicator.count()) > 0;
  }

  /**
   * "신청하기" / "결제하기" / "구매하기" 버튼 클릭.
   * "시작" 은 이미 신청한 사용자에게 보이는 라이브러리 진입 버튼이라 제외.
   */
  async clickApply() {
    const button = this.page
      .getByRole('button', {
        name: /신청하기|결제하기|구매하기|결제|구매|신청/i,
      })
      .first();
    await expect(
      button,
      '신청/결제 버튼이 보여야 한다. 이미 신청한 상태라면 BE 에서 봇 계정의 신청 이력을 리셋한 뒤 재시도하세요.',
    ).toBeVisible({ timeout: 10_000 });
    await expect(button, '신청/결제 버튼이 활성 상태여야 한다').toBeEnabled();
    await button.click();
  }
}
