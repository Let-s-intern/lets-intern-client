/**
 * @jest-environment node
 *
 * send-error-webhook POST handler 통합 테스트.
 *
 * 검증 항목:
 *  - body 검증: error.message 누락 → 400
 *  - IGNORED_ERROR_MESSAGES 일치 → ignored: true (sendErrorToWebhook 안 부름)
 *  - crash 태그 → dedupe 우회, sendErrorToWebhook 매번 호출
 *  - 첫 발생 → sendErrorToWebhook 호출 + sent: true
 *  - 반복 → deduped: true (sendErrorToWebhook 안 부름) + dedupe count 증가
 */
import { NextRequest } from 'next/server';

// 외부 의존성 mock
jest.mock('@/utils/webhook', () => ({
  sendErrorToWebhook: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: (name: string) => (name === 'user-agent' ? 'jest-test/1.0' : null),
  }),
}));

import { POST } from './route';
import { sendErrorToWebhook } from '@/utils/webhook';
import { clearAll, peekAll } from '@/utils/errorDedupe';

const mockedSend = sendErrorToWebhook as jest.MockedFunction<
  typeof sendErrorToWebhook
>;

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest('https://example.com/api/send-error-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/send-error-webhook', () => {
  beforeEach(() => {
    clearAll();
    mockedSend.mockClear();
  });

  describe('body 검증', () => {
    it('error 누락 → 400', async () => {
      const res = await POST(createPostRequest({}));
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('error.message 누락 → 400', async () => {
      const res = await POST(createPostRequest({ error: { name: 'E' } }));
      expect(res.status).toBe(400);
    });
  });

  describe('IGNORED_ERROR_MESSAGES', () => {
    it('Minified React error #418 → ignored', async () => {
      const res = await POST(
        createPostRequest({
          error: {
            name: 'Error',
            message: 'Something Minified React error #418 happened',
          },
        }),
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ignored).toBe(true);
      expect(mockedSend).not.toHaveBeenCalled();
    });

    it('GTM b.parentNode 패턴 → ignored', async () => {
      const res = await POST(
        createPostRequest({
          error: {
            name: 'TypeError',
            message:
              "null is not an object (evaluating 'b.parentNode') at gtm.js",
          },
        }),
      );
      const body = await res.json();
      expect(body.ignored).toBe(true);
      expect(mockedSend).not.toHaveBeenCalled();
    });
  });

  describe('crash 태그 우회', () => {
    it('crash: "true" → 매번 sendErrorToWebhook 호출 (dedupe 우회)', async () => {
      const payload = {
        error: { name: 'ChunkLoadError', message: 'session crash' },
        tags: { crash: 'true' },
      };

      for (let i = 0; i < 3; i++) {
        const res = await POST(createPostRequest(payload));
        const body = await res.json();
        expect(body.sent).toBe(true);
        expect(body.crash).toBe(true);
      }

      expect(mockedSend).toHaveBeenCalledTimes(3);
      // dedupe store 는 crash 면 record 안 됨
      expect(peekAll()).toEqual([]);
    });

    it('crash 가 string "true" 외에는 dedupe 적용', async () => {
      // boolean true 는 적용 안 됨 (normalizeSentryTags 가 string 으로 변환하므로
      // 실제로는 도달 불가능한 케이스지만 코드 안전성 검증)
      const payload = {
        error: { name: 'E', message: 'm' },
        tags: { crash: true }, // boolean
      };

      await POST(createPostRequest(payload));
      await POST(createPostRequest(payload));

      // crash 인식 안 됨 → dedupe 적용 → 첫 발생만 sendErrorToWebhook 호출
      expect(mockedSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('dedupe (crash 아닐 때)', () => {
    it('첫 발생 → sendErrorToWebhook 호출 + sent: true', async () => {
      const res = await POST(
        createPostRequest({
          error: { name: 'TypeError', message: 'first error' },
          tags: {},
        }),
      );
      const body = await res.json();
      expect(body.sent).toBe(true);
      expect(body.crash).toBe(false);
      expect(mockedSend).toHaveBeenCalledTimes(1);

      // dedupe store 에 기록됨
      const entries = peekAll();
      expect(entries).toHaveLength(1);
      expect(entries[0].count).toBe(1);
    });

    it('같은 signature 재호출 → deduped, sendErrorToWebhook 안 부름', async () => {
      const payload = {
        error: { name: 'E', message: 'm' },
        tags: {},
      };

      await POST(createPostRequest(payload));
      mockedSend.mockClear();

      const res = await POST(createPostRequest(payload));
      const body = await res.json();
      expect(body.deduped).toBe(true);
      expect(mockedSend).not.toHaveBeenCalled();
    });

    it('반복 시 dedupe count 증가', async () => {
      const payload = {
        error: { name: 'E', message: 'm' },
        tags: {},
      };

      await POST(createPostRequest(payload));
      await POST(createPostRequest(payload));
      await POST(createPostRequest(payload));

      const entries = peekAll();
      expect(entries).toHaveLength(1);
      expect(entries[0].count).toBe(3);
      expect(mockedSend).toHaveBeenCalledTimes(1); // 첫 1번만
    });

    it('다른 signature → 각자 첫 발생으로 sendErrorToWebhook 호출', async () => {
      await POST(
        createPostRequest({
          error: { name: 'A', message: '1' },
          tags: {},
        }),
      );
      await POST(
        createPostRequest({
          error: { name: 'B', message: '2' },
          tags: {},
        }),
      );

      expect(mockedSend).toHaveBeenCalledTimes(2);
      expect(peekAll()).toHaveLength(2);
    });

    it('error.name 누락 시 "Error" 로 fallback', async () => {
      await POST(
        createPostRequest({
          error: { message: 'no name' },
          tags: {},
        }),
      );

      const entries = peekAll();
      expect(entries[0].name).toBe('Error');
    });
  });

  describe('sendErrorToWebhook 호출 인자', () => {
    it('url, userAgent, tags, extra 가 그대로 전달', async () => {
      await POST(
        createPostRequest({
          error: { name: 'E', message: 'm' },
          url: 'https://example.com/page',
          userAgent: 'browser/1.0',
          tags: { domain: 'blog' },
          extra: { foo: 'bar' },
        }),
      );

      expect(mockedSend).toHaveBeenCalledTimes(1);
      const [errorArg, infoArg] = mockedSend.mock.calls[0];
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.message).toBe('m');
      expect(errorArg.name).toBe('E');
      expect(infoArg?.url).toBe('https://example.com/page');
      expect(infoArg?.userAgent).toBe('browser/1.0');
      expect(infoArg?.tags).toEqual({ domain: 'blog' });
      expect(infoArg?.extra).toEqual({ foo: 'bar' });
    });

    it('userAgent 누락 시 headers() 의 user-agent 로 fallback', async () => {
      await POST(
        createPostRequest({
          error: { name: 'E', message: 'm' },
          tags: {},
        }),
      );

      const [, infoArg] = mockedSend.mock.calls[0];
      expect(infoArg?.userAgent).toBe('jest-test/1.0');
    });
  });
});
