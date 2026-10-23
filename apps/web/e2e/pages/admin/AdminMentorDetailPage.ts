import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ADMIN_URL } from '../../support/lc3492';

/**
 * 어드민 멘토 상세 (/mentors/:mentorId).
 * 기본 정보·키워드·프로필 상세페이지(LC-3501), 경력 수정·대표 지정(LC-3497), 로고(LC-3499),
 * 후기 노출 순서(LC-3502)가 한 화면에 있다.
 */
export class AdminMentorDetailPage extends BasePage {
  async goto(mentorId: number): Promise<this> {
    await this.page.goto(`${ADMIN_URL}/mentors/${mentorId}`);
    await expect(this.page.getByText('기본 정보', { exact: true })).toBeVisible(
      {
        timeout: 15_000,
      },
    );
    await this.settle();
    return this;
  }

  // ── 기본 정보 ──────────────────────────────────────────────

  async setIntroduction(text: string): Promise<void> {
    await this.page.getByPlaceholder('한줄 소개를 입력해주세요').fill(text);
  }

  /** 프로필 상세페이지(Lexical) 본문을 비우고 글을 쓴다 */
  async replaceDescription(text: string): Promise<void> {
    const editor = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('프로필 상세페이지', { exact: true }),
      })
      .locator('[contenteditable="true"]')
      .last();
    await editor.click();
    await this.page.keyboard.press('ControlOrMeta+a');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(text);
  }

  keywordChip(title: string): Locator {
    return this.page.getByRole('button', { name: `#${title}`, exact: true });
  }

  /** 아직 고르지 않은 키워드 칩 이름 */
  async unselectedKeywords(): Promise<string[]> {
    const chips = this.page.locator('button[aria-pressed="false"]', {
      hasText: /^#/,
    });
    return (await chips.allInnerTexts()).map((text) => text.replace(/^#/, ''));
  }

  /** 기본 정보 「저장」. 프로필 PATCH 응답을 돌려준다(본문 포함 여부 확인용) */
  async saveBasicInfo(): Promise<Record<string, unknown>> {
    const patched = this.page.waitForResponse(
      (res) =>
        /\/user\/\d+$/.test(new URL(res.url()).pathname) &&
        res.request().method() === 'PATCH',
    );
    await this.page
      .getByRole('button', { name: '저장', exact: true })
      .first()
      .click();
    const res = await patched;
    expect(res.ok(), `프로필 저장 응답 ${res.status()}`).toBe(true);
    await this.settle();
    return res.request().postDataJSON() as Record<string, unknown>;
  }

  /** 대표 회사 로고를 라이브러리 로고에 연결한다. 저장(기본 정보 저장 버튼) 때 corp-logo PATCH 로 나간다 */
  async pickCorpLogo(logoName: string): Promise<void> {
    // 대표 로고 이미지를 누르면 라이브러리 선택 창이 바로 열린다
    await this.page
      .getByRole('button', { name: '대표 회사 로고 변경', exact: true })
      .click();
    await this.pickLogoInDialog(logoName);
  }

  private async pickLogoInDialog(logoName: string): Promise<void> {
    const picker = this.page
      .getByRole('dialog')
      .filter({ has: this.page.getByText('로고 선택', { exact: true }) });
    await picker.getByRole('button', { name: logoName, exact: true }).click();
    await picker.getByRole('button', { name: '선택', exact: true }).click();
    await expect(picker).toBeHidden();
  }

  // ── 경력 ──────────────────────────────────────────────────

  careerRow(company: string): Locator {
    return this.page.locator('div.rounded.border.p-4').filter({
      hasText: company,
    });
  }

  /** 대표가 아닌 경력의 회사명 목록 */
  async nonRepresentativeCompanies(): Promise<string[]> {
    const rows = this.page.locator('div.rounded.border.p-4').filter({
      has: this.page.getByRole('button', { name: '대표로 지정', exact: true }),
    });
    return rows.locator('div.font-medium').allInnerTexts();
  }

  async setRepresentative(company: string): Promise<void> {
    const patched = this.page.waitForResponse(
      (res) =>
        res.url().includes('/representative') &&
        res.request().method() === 'PATCH',
    );
    await this.careerRow(company)
      .getByRole('button', { name: '대표로 지정', exact: true })
      .click();
    // 확인 창에서 한 번 더 누른다
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: '대표로 지정', exact: true })
      .click();
    expect((await patched).ok(), '대표 경력 지정이 성공해야 한다').toBe(true);
    await this.settle();
  }

  /** 경력 행의 로고 칸을 눌러 수정 창 없이 로고를 바로 연결한다 */
  async setCareerLogo(company: string, logoName: string): Promise<void> {
    await this.page
      .getByRole('button', { name: `${company} 경력 로고 변경`, exact: true })
      .click();
    const linked = this.page.waitForResponse(
      (res) =>
        res.url().includes('/company-logo') &&
        res.url().includes('/admin/user-career/') &&
        res.request().method() === 'PATCH',
    );
    await this.pickLogoInDialog(logoName);
    expect((await linked).ok(), '경력 로고 연결이 성공해야 한다').toBe(true);
    await this.settle();
  }

  /** 경력 수정 다이얼로그로 직무·로고 연결을 바꾸고 저장한다. 로고는 경력 PATCH 뒤 company-logo PATCH 로 나간다 */
  async editCareer(
    company: string,
    changes: { job?: string; logoName?: string },
  ): Promise<void> {
    await this.careerRow(company)
      .getByRole('button', { name: '수정', exact: true })
      .click();
    const dialog = this.page
      .getByRole('dialog')
      .filter({ has: this.page.getByText('경력 수정', { exact: true }) });
    if (changes.job) await dialog.getByLabel(/^직무/).fill(changes.job);
    if (changes.logoName) {
      await dialog
        .getByRole('button', { name: '라이브러리에서 선택', exact: true })
        .click();
      await this.pickLogoInDialog(changes.logoName);
    }
    const patched = this.page.waitForResponse(
      (res) =>
        /\/admin\/user-career\/user\/\d+\/\d+$/.test(
          new URL(res.url()).pathname,
        ) && res.request().method() === 'PATCH',
    );
    const logoLinked = changes.logoName
      ? this.page.waitForResponse(
          (res) =>
            res.url().includes('/company-logo') &&
            res.url().includes('/admin/user-career/') &&
            res.request().method() === 'PATCH',
        )
      : null;
    await dialog.getByRole('button', { name: '저장', exact: true }).click();
    expect((await patched).ok(), '경력 수정이 성공해야 한다').toBe(true);
    if (logoLinked) {
      expect((await logoLinked).ok(), '경력 로고 연결이 성공해야 한다').toBe(
        true,
      );
    }
    await expect(dialog).toBeHidden();
    await this.settle();
  }

  // ── 후기 노출 순서 ─────────────────────────────────────────

  private get reviewRows(): Locator {
    return this.page
      .locator('div.rounded-lg')
      .filter({ hasText: '멘토 페이지 후기' })
      .locator('tbody tr');
  }

  /** 노출 후기의 본문(순위 순서). 숨긴 후기는 빠진다 */
  async exposedReviewTexts(): Promise<string[]> {
    const rows = this.reviewRows.filter({
      has: this.page.getByLabel('노출 순위', { exact: true }),
    });
    return rows.locator('td:nth-child(5) p').allInnerTexts();
  }

  async setReviewRank(index: number, rank: number): Promise<void> {
    const input = this.reviewRows
      .getByLabel('노출 순위', { exact: true })
      .nth(index);
    await input.fill(String(rank));
    await input.press('Enter');
  }

  async saveReviewOrder(): Promise<void> {
    const saved = this.page.waitForResponse(
      (res) =>
        res.url().includes('/reviews/order') &&
        res.request().method() === 'PUT',
    );
    await this.page
      .getByRole('button', { name: '순서 저장', exact: true })
      .click();
    expect((await saved).ok(), '후기 순서 저장이 성공해야 한다').toBe(true);
    await this.settle();
  }
}
