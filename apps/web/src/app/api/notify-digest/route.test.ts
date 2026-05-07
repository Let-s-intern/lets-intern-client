/**
 * @jest-environment node
 *
 * notify-digest GET handler 통합 테스트.
 *
 * Node 환경 사용 이유: NextRequest 가 Web standard Request 에 의존하는데
 * jsdom 환경에는 Request 가 polyfill 되어 있지 않음. Node 18+ 의 native
 * Request/Response/fetch 를 사용하기 위해 환경 전환.
 *
 * 검증 항목:
 *  - 인증: production secret 미설정 시 500, 잘못된 헤더 시 401, 정상 200
 *  - 빈 store: count 0 응답
 *  - entries 있음 + webhook 성공: 200 + store cleared
 *  - entries 있음 + webhook 실패: 500 + store 보존 (재시도 가능)
 *  - non-production: secret 미설정도 통과
 *  - webhook URL 미설정: count 반환 + 발송 스킵
 */
import { NextRequest } from 'next/server';
import { GET } from './route';
import {
  clearAll,
  peekAll,
  recordAndCheckFirst,
} from '@/utils/errorDedupe';

const ORIGINAL_ENV = { ...process.env };
const SECRET = 'test-cron-secret-32chars-12345678';
const WEBHOOK_URL = 'https://hooks.slack.com/test/webhook';

function createGetRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('https://example.com/api/notify-digest', {
    method: 'GET',
    headers,
  });
}

describe('GET /api/notify-digest', () => {
  // 실패 케이스 테스트가 의도적으로 console.error 를 트리거하므로 출력 노이즈 억제.
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    clearAll();
    // env 격리 — 매 테스트 시작 시 깨끗한 상태
    process.env = { ...ORIGINAL_ENV };
    delete process.env.CRON_SECRET;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.ERROR_WEBHOOK_URL;
    delete process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL;
    // global fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(null, { status: 200 })),
    ) as unknown as typeof fetch;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('인증', () => {
    it('production + CRON_SECRET 미설정 → 500', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      // CRON_SECRET 없음

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('CRON_SECRET');
    });

    it('production + secret 설정 + Authorization 헤더 없음 → 401', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;

      const res = await GET(createGetRequest());
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.message).toBe('Unauthorized');
    });

    it('production + secret 설정 + 잘못된 헤더 → 401', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;

      const res = await GET(
        createGetRequest({ authorization: 'Bearer wrong-secret' }),
      );
      expect(res.status).toBe(401);
    });

    it('production + secret 설정 + 정확한 헤더 + 빈 store → 200', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;

      const res = await GET(
        createGetRequest({ authorization: `Bearer ${SECRET}` }),
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.count).toBe(0);
    });

    it('non-production + secret 미설정 → 200 (테스트 편의 통과)', async () => {
      // NEXT_PUBLIC_VERCEL_ENV 없음 → non-production 으로 간주
      const res = await GET(createGetRequest());
      expect(res.status).toBe(200);
    });

    it('non-production + secret 설정 + 헤더 일치 → 200', async () => {
      process.env.CRON_SECRET = SECRET;

      const res = await GET(
        createGetRequest({ authorization: `Bearer ${SECRET}` }),
      );
      expect(res.status).toBe(200);
    });

    it('non-production + secret 설정 + 헤더 불일치 → 401', async () => {
      // secret 설정만 되어 있으면 환경 무관 검증 (route 코드의 두 번째 if 분기)
      process.env.CRON_SECRET = SECRET;

      const res = await GET(
        createGetRequest({ authorization: 'Bearer wrong' }),
      );
      expect(res.status).toBe(401);
    });
  });

  describe('빈 store', () => {
    it('entries 0 → count 0, fetch 호출 안 됨', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;

      const res = await GET(
        createGetRequest({ authorization: `Bearer ${SECRET}` }),
      );
      const body = await res.json();
      expect(body.count).toBe(0);
      expect(body.message).toBe('집계 항목 없음');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('webhook URL 미설정', () => {
    it('store 에 entries 있어도 URL 없으면 발송 스킵', async () => {
      recordAndCheckFirst('s1', { name: 'E', message: 'm' });

      const res = await GET(createGetRequest());
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.count).toBe(1);
      expect(body.message).toBe('webhook 미설정');
      expect(global.fetch).not.toHaveBeenCalled();

      // store 는 보존 (clear 호출 안 됨)
      expect(peekAll()).toHaveLength(1);
    });
  });

  describe('정상 발송 (peek/clear 패턴)', () => {
    it('webhook 성공 시 store 비워짐', async () => {
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      recordAndCheckFirst('s1', { name: 'E', message: 'm1' });
      recordAndCheckFirst('s2', { name: 'F', message: 'm2' });

      const res = await GET(createGetRequest());
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.count).toBe(2);

      // fetch 호출 검증
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledInit] = (global.fetch as jest.Mock).mock
        .calls[0];
      expect(calledUrl).toBe(WEBHOOK_URL);
      expect(calledInit.method).toBe('POST');
      const sentBody = JSON.parse(calledInit.body);
      expect(sentBody.text).toContain('일일 에러 디제스트');
      expect(Array.isArray(sentBody.blocks)).toBe(true);

      // 성공 후 store 비워짐
      expect(peekAll()).toEqual([]);
    });
  });

  describe('실패 시 회복 (store 보존)', () => {
    it('webhook 5xx → 500 응답 + store 유지 (다음 cron 재시도)', async () => {
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      recordAndCheckFirst('s1', { name: 'E', message: 'm' });

      // fetch 가 5xx 를 리턴
      global.fetch = jest.fn(() =>
        Promise.resolve(new Response(null, { status: 500 })),
      ) as unknown as typeof fetch;

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.count).toBe(1);
      expect(typeof body.error).toBe('string');

      // store 보존 — 재시도 가능
      expect(peekAll()).toHaveLength(1);
    });

    it('fetch 가 throw → 500 응답 + store 유지', async () => {
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      recordAndCheckFirst('s1', { name: 'E', message: 'm' });

      global.fetch = jest.fn(() =>
        Promise.reject(new Error('network down')),
      ) as unknown as typeof fetch;

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain('network down');

      expect(peekAll()).toHaveLength(1);
    });
  });

  describe('digest 메시지 포맷', () => {
    it('count 내림차순 정렬 + top 20 + 카운트 라인 포함', async () => {
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      // 25건 누적: 카운트 1, 2, ..., 25 로 차이 두기
      for (let i = 0; i < 25; i++) {
        const sig = `s${i}`;
        for (let j = 0; j <= i; j++) {
          recordAndCheckFirst(sig, {
            name: `Err${i}`,
            message: `msg${i}`,
          });
        }
      }

      await GET(createGetRequest());
      const sentBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );

      // header + section + divider + 20개 entry section + context
      // → blocks 수 ≥ 23
      expect(sentBody.blocks.length).toBeGreaterThanOrEqual(23);

      // 첫 entry block (index 3) 가 가장 큰 카운트 (Err24, 25회)
      const firstEntry = sentBody.blocks[3].text.text;
      expect(firstEntry).toContain('Err24');
      expect(firstEntry).toContain('25회');

      // context block 이 마지막에 들어감 (전체 25 중 20만 표시 안내)
      const lastBlock = sentBody.blocks[sentBody.blocks.length - 1];
      expect(lastBlock.type).toBe('context');
      expect(lastBlock.elements[0].text).toContain('25');
    });

    it('20건 이하면 context block 안 붙음', async () => {
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      for (let i = 0; i < 5; i++) {
        recordAndCheckFirst(`s${i}`, {
          name: 'E',
          message: `m${i}`,
        });
      }

      await GET(createGetRequest());
      const sentBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );
      const types = sentBody.blocks.map((b: { type: string }) => b.type);
      expect(types).not.toContain('context');
    });
  });
});
