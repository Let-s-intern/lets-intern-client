import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveHealthyJitsiBaseUrl } from '../jitsiHealthCheck';

describe('resolveHealthyJitsiBaseUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('첫 번째 도메인이 healthy 하면 그 base URL(슬래시 보정)을 반환한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const result = await resolveHealthyJitsiBaseUrl([
      'https://primary.example',
      'https://fallback.example',
    ]);

    expect(result).toBe('https://primary.example/');
    // 첫 도메인에서 성공했으므로 fallback 은 호출되지 않는다.
    expect(fetch).toHaveBeenCalledTimes(1);
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
