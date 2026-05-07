/**
 * @jest-environment node
 *
 * notify-digest GET handler 통합 테스트.
 *
 * 데이터 소스가 Sentry Issues API 라 fetch 를 모킹.
 * 두 종류의 fetch 호출이 존재:
 *  1. Sentry API (https://sentry.io/api/0/...) — issues 조회
 *  2. Slack webhook URL — digest 발송
 */
import { NextRequest } from 'next/server';
import { GET } from './route';

const ORIGINAL_ENV = { ...process.env };
const SECRET = 'test-cron-secret-32chars-12345678';
const SENTRY_TOKEN = 'sentry-test-token';
const ORG_SLUG = 'letsintern';
const WEBHOOK_URL = 'https://hooks.slack.com/test/webhook';

function createGetRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('https://example.com/api/notify-digest', {
    method: 'GET',
    headers,
  });
}

type SentryIssueFixture = {
  id: string;
  shortId?: string;
  title: string;
  culprit?: string;
  level?: string;
  count: number;
  userCount?: number;
  firstSeen: string;
  lastSeen: string;
  permalink?: string;
  metadata?: { type?: string; value?: string };
};

const sampleIssue = (
  overrides: Partial<SentryIssueFixture> = {},
): SentryIssueFixture => ({
  id: '1001',
  shortId: 'WEB-1',
  title: 'TypeError: Cannot read property foo',
  culprit: 'src/app/page.tsx',
  level: 'error',
  count: 10,
  userCount: 3,
  firstSeen: '2026-05-07T01:00:00.000Z',
  lastSeen: '2026-05-07T02:00:00.000Z',
  permalink: 'https://sentry.io/organizations/letsintern/issues/1001/',
  metadata: { type: 'TypeError', value: 'foo is undefined' },
  ...overrides,
});

function mockFetch(
  sentryIssues: SentryIssueFixture[] | { error: unknown; status?: number },
  slackResponse: { ok: boolean; status?: number } = { ok: true, status: 200 },
): jest.Mock {
  const mock = jest.fn(async (input: string | URL | Request) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.startsWith('https://sentry.io/api/')) {
      if ('error' in sentryIssues) {
        return new Response(String(sentryIssues.error), {
          status: sentryIssues.status ?? 500,
        });
      }
      return new Response(JSON.stringify(sentryIssues), { status: 200 });
    }
    // Slack webhook
    return new Response(slackResponse.ok ? 'ok' : 'fail', {
      status: slackResponse.status ?? (slackResponse.ok ? 200 : 500),
    });
  });
  global.fetch = mock as unknown as typeof fetch;
  return mock;
}

describe('GET /api/notify-digest', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.CRON_SECRET;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.SENTRY_AUTH_TOKEN;
    delete process.env.SENTRY_ORG_SLUG;
    delete process.env.SENTRY_PROJECT_SLUG;
    delete process.env.SENTRY_PROJECT_ID;
    delete process.env.ERROR_WEBHOOK_URL;
    delete process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL;
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
      mockFetch([]);

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.message).toContain('CRON_SECRET');
    });

    it('production + secret 설정 + Authorization 헤더 없음 → 401', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;
      mockFetch([]);

      const res = await GET(createGetRequest());
      expect(res.status).toBe(401);
    });

    it('production + secret 일치 + 정상 응답 → 200', async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.CRON_SECRET = SECRET;
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      mockFetch([sampleIssue()]);

      const res = await GET(
        createGetRequest({ authorization: `Bearer ${SECRET}` }),
      );
      expect(res.status).toBe(200);
    });

    it('non-production + secret 미설정 → 통과', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      mockFetch([]);

      const res = await GET(createGetRequest());
      expect(res.status).toBe(200);
    });
  });

  describe('Sentry API 설정 누락', () => {
    it('SENTRY_AUTH_TOKEN 미설정 → 500', async () => {
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.message).toContain('SENTRY_AUTH_TOKEN');
    });

    it('SENTRY_ORG_SLUG 미설정 → 500', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
    });
  });

  describe('Sentry API 호출', () => {
    it('Sentry API 5xx → 500 응답', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      mockFetch({ error: 'Internal Server Error', status: 500 });

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.message).toBe('Sentry API 조회 실패');
    });

    it('빈 issues 배열 → count 0 + Slack 발송 안 함', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      const fetchMock = mockFetch([]);

      const res = await GET(createGetRequest());
      const body = await res.json();
      expect(body.count).toBe(0);
      // Sentry 호출만 하고 Slack 호출 X (1회 호출)
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('Sentry API 호출에 토큰/슬러그/환경 파라미터 포함', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.SENTRY_PROJECT_ID = '12345';
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      const fetchMock = mockFetch([sampleIssue()]);

      await GET(createGetRequest());
      const sentryCall = fetchMock.mock.calls.find((c) =>
        String(c[0]).startsWith('https://sentry.io/api/'),
      );
      expect(sentryCall).toBeDefined();

      const url = String(sentryCall![0]);
      expect(url).toContain(`/organizations/${ORG_SLUG}/issues/`);
      expect(url).toContain('statsPeriod=24h');
      expect(url).toContain('environment=production');
      expect(url).toContain('project=12345');
      expect(url).toContain('sort=freq');

      const init = sentryCall![1] as RequestInit;
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe(`Bearer ${SENTRY_TOKEN}`);
    });
  });

  describe('webhook 발송', () => {
    it('webhook URL 미설정 → 발송 스킵, count 반환', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      mockFetch([sampleIssue()]);

      const res = await GET(createGetRequest());
      const body = await res.json();
      expect(body.count).toBe(1);
      expect(body.message).toBe('webhook 미설정');
    });

    it('webhook 성공 → 200 + count 반환', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      mockFetch([sampleIssue(), sampleIssue({ id: '1002', count: 5 })]);

      const res = await GET(createGetRequest());
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.count).toBe(2);
    });

    it('webhook 실패 → 500 응답', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;
      mockFetch([sampleIssue()], { ok: false, status: 500 });

      const res = await GET(createGetRequest());
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
    });
  });

  describe('digest 메시지 포맷', () => {
    it('헤더 + 발생 요약 + level 분포 + Top 이슈 블록 포함', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;

      const issues = [
        sampleIssue({
          id: '1',
          title: 'TypeError: foo',
          metadata: { type: 'TypeError' },
          count: 50,
          userCount: 5,
          level: 'error',
        }),
        sampleIssue({
          id: '2',
          title: 'ApiError: PROFILE_LOAD_FAILED',
          metadata: { type: 'ApiError' },
          count: 30,
          userCount: 3,
          level: 'warning',
        }),
        sampleIssue({
          id: '3',
          title: 'ChunkLoadError: Loading chunk 42',
          metadata: { type: 'ChunkLoadError' },
          count: 10,
          userCount: 2,
          level: 'fatal',
        }),
      ];
      const fetchMock = mockFetch(issues);

      await GET(createGetRequest());

      const slackCall = fetchMock.mock.calls.find((c) =>
        String(c[0]).startsWith(WEBHOOK_URL),
      );
      expect(slackCall).toBeDefined();
      const body = JSON.parse((slackCall![1] as { body: string }).body);

      // 헤더
      expect(body.blocks[0].type).toBe('header');
      expect(body.blocks[0].text.text).toContain('일일 에러 디제스트');

      // 요약 섹션
      const summary = body.blocks[1].text.text as string;
      expect(summary).toContain('고유 이슈 *3건*');
      expect(summary).toContain('총 이벤트 *90회*');
      expect(summary).toContain('영향 사용자 약 *10명*');

      // level 분포 + 종류 Top 5 섹션 존재
      const sectionTexts = body.blocks
        .map((b: { text?: { text?: string } }) => b.text?.text ?? '')
        .join('\n');
      expect(sectionTexts).toContain('Level 분포');
      expect(sectionTexts).toContain('에러 종류 Top 5');

      // Top 이슈 상세 — 첫 번째가 가장 높은 count
      const topSectionIdx = body.blocks.findIndex(
        (b: { text?: { text?: string } }) =>
          b.text?.text?.includes('상위'),
      );
      expect(topSectionIdx).toBeGreaterThanOrEqual(0);
      const firstIssueBlock = body.blocks[topSectionIdx + 1];
      expect(firstIssueBlock.text.text).toContain('TypeError: foo');
      expect(firstIssueBlock.text.text).toContain('50회');
      expect(firstIssueBlock.text.text).toContain('5명');
    });

    it('10건 초과 시 context block 추가 (전체 안내)', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;

      const issues = Array.from({ length: 15 }, (_, i) =>
        sampleIssue({ id: String(i), count: 15 - i }),
      );
      const fetchMock = mockFetch(issues);

      await GET(createGetRequest());
      const slackCall = fetchMock.mock.calls.find((c) =>
        String(c[0]).startsWith(WEBHOOK_URL),
      );
      const body = JSON.parse((slackCall![1] as { body: string }).body);

      const lastBlock = body.blocks[body.blocks.length - 1];
      expect(lastBlock.type).toBe('context');
      expect(lastBlock.elements[0].text).toContain('전체 15건');
    });

    it('@ 멘션 escape', async () => {
      process.env.SENTRY_AUTH_TOKEN = SENTRY_TOKEN;
      process.env.SENTRY_ORG_SLUG = ORG_SLUG;
      process.env.ERROR_WEBHOOK_URL = WEBHOOK_URL;

      const fetchMock = mockFetch([
        sampleIssue({ title: '@channel @here malicious mention attempt' }),
      ]);

      await GET(createGetRequest());
      const slackCall = fetchMock.mock.calls.find((c) =>
        String(c[0]).startsWith(WEBHOOK_URL),
      );
      const body = JSON.parse((slackCall![1] as { body: string }).body);
      const sectionTexts = body.blocks
        .map((b: { text?: { text?: string } }) => b.text?.text ?? '')
        .join('\n');
      expect(sectionTexts).toContain('(at)channel');
      expect(sectionTexts).toContain('(at)here');
      expect(sectionTexts).not.toContain('@channel');
    });
  });
});
