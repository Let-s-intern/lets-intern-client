import type { Page } from '@playwright/test';
import { settle } from '../helpers/settle';

/** 모든 Page Object 의 공통 베이스. page reference 와 settle 헬퍼만 노출. */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  /** 페이지 이동/클릭 후 settle 대기 (BE fetch + React state 안정화). */
  protected async settle(extraMs?: number) {
    await settle(this.page, extraMs);
  }
}
