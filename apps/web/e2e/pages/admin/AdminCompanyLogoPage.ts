import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { ADMIN_URL } from '../../support/lc3492';

// 업로드에 쓰는 1x1 PNG. 실제 업로드가 막히면 스펙이 응답을 가짜 주소로 바꾼다
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

/** 어드민 회사 로고 라이브러리 (/mentors/company-logos, LC-3498) */
export class AdminCompanyLogoPage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto(`${ADMIN_URL}/mentors/company-logos`);
    await expect(
      this.page.getByRole('heading', { name: '회사 로고' }),
    ).toBeVisible({ timeout: 15_000 });
    await this.settle();
    return this;
  }

  card(name: string): Locator {
    return this.page.locator('li').filter({ hasText: name });
  }

  async register(name: string): Promise<void> {
    await this.page.getByRole('button', { name: '로고 등록' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('회사명').fill(name);
    await dialog.getByLabel('로고 이미지 업로드').setInputFiles({
      name: 'logo.png',
      mimeType: 'image/png',
      buffer: PNG_1PX,
    });
    const save = dialog.getByRole('button', { name: '저장' });
    await expect(save, '이미지가 올라가면 저장이 켜져야 한다').toBeEnabled({
      timeout: 15_000,
    });
    const created = this.page.waitForResponse(
      (res) =>
        res.url().includes('/admin/company-logo') &&
        res.request().method() === 'POST',
    );
    await save.click();
    expect((await created).ok(), '로고 등록 응답이 성공이어야 한다').toBe(true);
    await expect(dialog).toBeHidden();
    await this.settle();
  }

  async search(keyword: string): Promise<void> {
    await this.page.getByLabel('회사명 검색').fill(keyword);
  }
}
