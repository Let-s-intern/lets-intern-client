import type { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * 로그인 흐름 — POM 들을 조합한 재사용 가능한 시나리오 조각.
 *
 * 흐름: 홈 진입 → 상단 "로그인" 클릭 → /login 폼 입력 → 제출 → 홈 복귀
 * (LoginPage 내부에서 404 자동 복구)
 *
 * 다른 spec 들이 이 함수만 import 하면 로그인 단계 5줄을 1줄로 압축.
 */
export interface LoginFlowOptions {
  email: string;
  password: string;
  /** 홈 진입 후 settle 대기 (ms). */
  homeWait?: number;
  /** 로그인 완료 후 settle 대기 (ms). */
  afterLoginWait?: number;
}

export async function loginFlow(
  page: Page,
  options: LoginFlowOptions,
): Promise<HomePage> {
  const home = await new HomePage(page).goto(options.homeWait);
  const loginPage = await home.clickLogin();
  return loginPage.loginWith(
    options.email,
    options.password,
    options.afterLoginWait,
  );
}
