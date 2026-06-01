import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ensureLiveMeetingUrl,
  resolveHealthyJitsiBaseUrl,
} from './jitsiHealthCheck';

describe('resolveHealthyJitsiBaseUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('여러 도메인이 healthy 하면 우선순위가 가장 높은 base URL(슬래시 보정)을 반환한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const result = await resolveHealthyJitsiBaseUrl([
      'https://primary.example',
      'https://fallback.example',
    ]);

    expect(result).toBe('https://primary.example/');
    // 병렬 헬스체크라 모든 후보를 ping 하되, 결과 순서를 보존해 primary 를 고른다.
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('첫 번째가 실패하면 두 번째(fallback)로 폴백한다', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await resolveHealthyJitsiBaseUrl([
      'https://primary.example/',
      'https://fallback.example/',
    ]);

    expect(result).toBe('https://fallback.example/');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('모든 도메인이 실패하면 null 을 반환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));

    const result = await resolveHealthyJitsiBaseUrl([
      'https://a.example',
      'https://b.example',
    ]);

    expect(result).toBeNull();
  });

  it('빈/undefined 후보는 건너뛴다', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await resolveHealthyJitsiBaseUrl([
      undefined,
      '',
      'https://only.example',
    ]);

    expect(result).toBe('https://only.example/');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('ensureLiveMeetingUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('meetingUrl 이 이미 있으면 헬스체크/등록 없이 ok 를 반환한다', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: 'https://meet.example/room-abc',
      baseCandidates: ['https://primary.example'],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(registerBaseUrl).not.toHaveBeenCalled();
  });

  it('meetingUrl 이 없으면 healthy base 를 registerBaseUrl 로 등록하고 ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: null,
      baseCandidates: ['https://primary.example'],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: true });
    expect(registerBaseUrl).toHaveBeenCalledWith('https://primary.example/');
  });

  it('살아있는 도메인이 없으면 등록하지 않고 no-healthy-domain 을 반환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const registerBaseUrl = vi.fn().mockResolvedValue(undefined);

    const result = await ensureLiveMeetingUrl({
      meetingUrl: null,
      baseCandidates: ['https://primary.example'],
      registerBaseUrl,
    });

    expect(result).toEqual({ ok: false, reason: 'no-healthy-domain' });
    expect(registerBaseUrl).not.toHaveBeenCalled();
  });
});
