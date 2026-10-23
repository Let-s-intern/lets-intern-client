import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ADMIN_URL } from '../../support/lc3492';

/** 어드민 1:1 상세페이지 수정 (/live-mentoring/:mentorId/detail-page, LC-3496·3494·3495) */
export class AdminLiveMentoringDetailPageEditPage extends BasePage {
  async goto(mentorId: number): Promise<this> {
    await this.page.goto(`${ADMIN_URL}/live-mentoring/${mentorId}/detail-page`);
    await expect(
      this.page.getByRole('heading', { name: /멘토 상세페이지 수정$/ }),
    ).toBeVisible({ timeout: 15_000 });
    await this.settle();
    return this;
  }

  async openTab(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label, exact: true }).click();
  }

  heroBullet(index: number): Locator {
    return this.page.getByLabel(`소개 문구 ${index + 1}`, { exact: true });
  }

  /** 지금 탭의 「상세페이지에 표시」 체크 */
  async setVisible(visible: boolean): Promise<void> {
    await this.page
      .getByLabel('상세페이지에 표시', { exact: true })
      .setChecked(visible);
  }

  /** 자유 입력란 위치. 드롭다운에 보이는 이름으로 고른다(예: 「취업 성공 전략 뒤」) */
  async selectFreeContentPosition(label: string): Promise<void> {
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: label, exact: true }).click();
  }

  private get editor(): Locator {
    return this.page.locator('[contenteditable="true"]').first();
  }

  /** 자유 입력란 본문을 비우고 글을 쓴다 */
  async writeFreeContent(text: string): Promise<void> {
    await this.editor.click();
    await this.page.keyboard.press('ControlOrMeta+a');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(text);
  }

  /** 에디터 「삽입 > 이미지 > URL」 로 HTTPS 이미지를 넣는다(업로드 없이) */
  async insertImageByUrl(url: string): Promise<void> {
    await this.editor.click();
    await this.page.keyboard.press('ControlOrMeta+End');
    await this.page
      .getByRole('button', { name: 'Insert specialized editor node' })
      .click();
    await this.page
      .getByRole('button', { name: '이미지', exact: true })
      .click();
    await this.page.locator('[data-test-id="image-modal-option-url"]').click();
    await this.page.locator('[data-test-id="image-modal-url-input"]').fill(url);
    await this.page
      .locator('[data-test-id="image-modal-alt-text-input"]')
      .fill('자유 입력란 이미지');
    await this.page.locator('[data-test-id="image-modal-confirm-btn"]').click();
  }

  async save(): Promise<void> {
    const saved = this.page.waitForResponse(
      (res) =>
        /\/admin\/live-mentoring\/mentors\/\d+\/detail-page/.test(res.url()) &&
        res.request().method() === 'PUT',
    );
    await this.page.getByRole('button', { name: '저장', exact: true }).click();
    const res = await saved;
    expect(res.ok(), `상세페이지 저장 응답 ${res.status()}`).toBe(true);
    await expect(
      this.page.getByText('저장했습니다.', { exact: true }),
    ).toBeVisible();
  }
}
