/**
 * §8.5.1 / §8.5.T1 — login/page.tsx 가 utils/log wrapper를 호출하는지
 * 정적으로 검증한다. 페이지 자체는 zustand/router/axios에 강하게 결합되어
 * 통합 렌더 테스트는 비효율적이므로, 소스 레벨에서 wrapper 호출 호스팅
 * 사실만 단언한다.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE = readFileSync(resolve(__dirname, 'page.tsx'), 'utf8');

describe('login/page.tsx — Sentry Logs wrapper 사용', () => {
  it('signinSuccess 호출이 onSuccess 분기에 존재한다', () => {
    expect(SOURCE).toMatch(/log\.signinSuccess\s*\(\s*['"]password['"]/);
  });

  it('signinReject 호출이 onError 분기에 존재한다', () => {
    expect(SOURCE).toMatch(/log\.signinReject\s*\(\s*['"]password['"]/);
  });

  it('socialCallbackError 호출이 소셜 콜백 에러 분기에 존재한다', () => {
    expect(SOURCE).toMatch(/log\.socialCallbackError\s*\(/);
  });

  it('@/utils/log 모듈을 import한다', () => {
    expect(SOURCE).toMatch(
      /import\s+\*\s+as\s+log\s+from\s+['"]@\/utils\/log['"]/,
    );
  });
});
