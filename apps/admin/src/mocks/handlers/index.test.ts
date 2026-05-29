import { describe, expect, it } from 'vitest';

import { handlers } from './index';

/**
 * browser.ts 의 setupWorker 는 실제 브라우저(Service Worker) 환경에서만
 * 동작하므로 jsdom 단위 테스트에서는 인스턴스화하지 않는다.
 * 여기서는 worker 가 등록하는 handlers 묶음이 유효한지만 검증한다.
 * (핸들러 요청/응답 동작 검증은 adminFeedback.test.ts 에서 setupServer 로 수행)
 */
describe('MSW handlers 등록', () => {
  it('handlers 는 RequestHandler 배열이다', () => {
    expect(Array.isArray(handlers)).toBe(true);
  });

  it('등록된 모든 핸들러는 info 메타를 가진다', () => {
    handlers.forEach((handler) => {
      expect(handler).toHaveProperty('info');
    });
  });
});
