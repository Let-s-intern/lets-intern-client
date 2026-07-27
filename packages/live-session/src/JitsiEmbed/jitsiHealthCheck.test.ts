import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import {
  ensureLiveMeetingUrl,
  resolveHealthyJitsiBaseUrl,
} from './jitsiHealthCheck';

/** base 의 health.json 응답을 흉내내는 fetch mock 을 설치한다. */
function stubHealthFetch(
  impl: (url: string) => { ok: boolean; body?: unknown } | Error,
): Mock {
  const fetchMock = vi.fn(async (input: string) => {
    const result = impl(input);
    if (result instanceof Error) throw result;
    return {
      ok: result.ok,
      json: async () => result.body,
    } as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock as unknown as Mock;
}

const BASE = 'https://primary.example/';
const FALLBACK = 'https://fallback.example/';

describe('resolveHealthyJitsiBaseUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('base 가 healthy(status HEALTHY)면 base 를 반환한다', async () => {
    stubHealthFetch(() => ({ ok: true, body: { status: 'HEALTHY' } }));
    await expect(resolveHealthyJitsiBaseUrl([BASE, FALLBACK])).resolves.toBe(
      BASE,
    );
  });

  it('base 의 health.json 만 조회하며 캐시 우회 쿼리(?t=)를 붙인다', async () => {
    const fetchMock = stubHealthFetch(() => ({
      ok: true,
      body: { status: 'HEALTHY' },
    }));

    await resolveHealthyJitsiBaseUrl([BASE, FALLBACK]);

    const requested = fetchMock.mock.calls[0][0] as string;
    expect(requested).toMatch(
      /^https:\/\/primary\.example\/health\.json\?t=\d+$/,
    );
    // base 만 확인하고 fallback 은 건드리지 않는다.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('base 가 unhealthy(status 가 HEALTHY 아님)면 fallback 을 반환한다', async () => {
    stubHealthFetch(() => ({ ok: true, body: { status: 'DOWN' } }));
    await expect(resolveHealthyJitsiBaseUrl([BASE, FALLBACK])).resolves.toBe(
      FALLBACK,
    );
  });

  it('base 가 503(!ok)이면 fallback 을 반환한다', async () => {
    stubHealthFetch(() => ({ ok: false }));
    await expect(resolveHealthyJitsiBaseUrl([BASE, FALLBACK])).resolves.toBe(
      FALLBACK,
    );
  });

  it('base fetch 가 실패(CORS/네트워크)해도 fallback 으로 넘어간다', async () => {
    stubHealthFetch(() => new TypeError('Failed to fetch'));
    await expect(resolveHealthyJitsiBaseUrl([BASE, FALLBACK])).resolves.toBe(
      FALLBACK,
    );
  });

  it('base 가 죽었고 fallback 도 없으면 null', async () => {
    stubHealthFetch(() => ({ ok: false }));
    await expect(resolveHealthyJitsiBaseUrl([BASE])).resolves.toBeNull();
  });

  it('후보가 하나도 없으면 fetch 없이 null', async () => {
    const fetchMock = stubHealthFetch(() => ({
      ok: true,
      body: { status: 'HEALTHY' },
    }));
    await expect(
      resolveHealthyJitsiBaseUrl([undefined, '', '  ']),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('trailing slash 가 없는 base 도 정규화해서 반환한다', async () => {
    stubHealthFetch(() => ({ ok: true, body: { status: 'HEALTHY' } }));
    await expect(
      resolveHealthyJitsiBaseUrl(['https://primary.example']),
    ).resolves.toBe(BASE);
  });
});

describe('ensureLiveMeetingUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('meetingUrl 이 이미 있으면 헬스체크/등록 없이 ok 를 반환한다', async () => {
    const fetchMock = stubHealthFetch(() => ({ ok: true }));
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: 'https://meet.example/room-abc',
      baseCandidates: [BASE],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(registerBaseUrl).not.toHaveBeenCalled();
  });

  it('meetingUrl 이 없으면 healthy base 를 registerBaseUrl 로 등록하고 ok', async () => {
    stubHealthFetch(() => ({ ok: true, body: { status: 'HEALTHY' } }));
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: null,
      baseCandidates: [BASE],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: true });
    expect(registerBaseUrl).toHaveBeenCalledWith(BASE);
  });

  it('base 가 죽으면 fallback 을 등록한다', async () => {
    stubHealthFetch(() => ({ ok: false }));
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: null,
      baseCandidates: [BASE, FALLBACK],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: true });
    expect(registerBaseUrl).toHaveBeenCalledWith(FALLBACK);
  });

  it('base 가 죽었고 fallback 도 없으면 등록하지 않고 no-healthy-domain', async () => {
    stubHealthFetch(() => ({ ok: false }));
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: null,
      baseCandidates: [BASE],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: false, reason: 'no-healthy-domain' });
    expect(registerBaseUrl).not.toHaveBeenCalled();
  });
});
