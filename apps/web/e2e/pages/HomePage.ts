import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { ProgramListPage } from './ProgramListPage';

/** 렛츠커리어 홈 (/) Page Object. */
export class HomePage extends BasePage {
  /** 홈으로 이동하고 settle 대기. extraMs 로 spec 에서 대기시간 조정. */
  async goto(extraMs?: number): Promise<this> {
    await this.page.goto('/');
    await this.settle(extraMs);
    return this;
  }

  /** 상단 "로그인" 링크 클릭 -> /login 페이지로 이동. */
  async clickLogin(): Promise<LoginPage> {
    const loginLink = this.page
      .getByRole('link', { name: /^로그인$/ })
      .or(this.page.getByRole('button', { name: /^로그인$/ }))
      .first();
    await loginLink.click();
    const next = new LoginPage(this.page);
    await next.waitForLoaded();
    return next;
  }

  /**
   * 상단 "프로그램" 카테고리 hover 로 드롭다운 열기.
   * 데스크톱 nav 가 없으면 noop (mobile breakpoint 환경 보호).
   */
  async openProgramsDropdown(): Promise<this> {
    const trigger = this.page
      .getByRole('button', { name: /^프로그램$/ })
      .or(this.page.getByRole('link', { name: /^프로그램$/ }))
      .first();
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.hover().catch(() => undefined);
    }
    return this;
  }

  /**
   * /program 으로 직접 이동.
   * "전체 프로그램" 클릭은 모바일/데스크톱 메뉴 충돌이 잦아 URL navigation 으로 안전 우회.
   */
  async gotoAllPrograms(extraMs?: number): Promise<ProgramListPage> {
    await this.page.goto('/program');
    await this.settle(extraMs);
    return new ProgramListPage(this.page);
  }
}
