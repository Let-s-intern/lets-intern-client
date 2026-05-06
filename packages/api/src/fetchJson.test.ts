import { fetchJson, setFetchJsonStartSpan } from './fetchJson';
import { ApiError, SchemaParseError } from './errors';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeResponse(
  status: number,
  body: unknown,
  ok?: boolean,
): Response {
  const json = JSON.stringify(body);
  return {
    ok: ok !== undefined ? ok : (status >= 200 && status < 300),
    status,
    text: () => Promise.resolve(json),
  } as unknown as Response;
}

describe('fetchJson', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    setFetchJsonStartSpan(undefined);
  });

  it('200: 정상 응답 데이터를 반환한다', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { data: { id: 1 } }));
    const result = await fetchJson<{ id: number }>('/api/test', {
      code: 'TEST',
      displayMessage: '테스트',
    });
    expect(result).toEqual({ id: 1 });
  });

  it('200: data 래퍼 없으면 body 전체 반환', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { id: 2 }));
    const result = await fetchJson<{ id: number }>('/api/test', {
      code: 'TEST',
      displayMessage: '테스트',
    });
    expect(result).toEqual({ id: 2 });
  });

  it('4xx: ApiError를 throw하고 status/endpoint/method가 보존된다', async () => {
    mockFetch.mockResolvedValue(
      makeResponse(404, { message: '리소스 없음' }, false),
    );
    await expect(
      fetchJson('/api/vods/999', {
        method: 'GET',
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'VOD 조회에 실패했습니다.',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof ApiError)) return false;
      expect(err.status).toBe(404);
      expect(err.endpoint).toBe('/api/vods/999');
      expect(err.method).toBe('GET');
      expect(err.code).toBe('VOD_FETCH_FAILED');
      expect(err.serverMessage).toBe('리소스 없음');
      return true;
    });
  });

  it('5xx: ApiError를 throw하고 responseBody context가 보존된다', async () => {
    const responseBody = { message: '서버 내부 오류' };
    mockFetch.mockResolvedValue(makeResponse(500, responseBody, false));
    await expect(
      fetchJson('/api/vods/1', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'VOD 조회에 실패했습니다.',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof ApiError)) return false;
      expect(err.status).toBe(500);
      expect(err.context).toHaveProperty('responseBody');
      return true;
    });
  });

  it('network 실패: ApiError with code _NETWORK를 throw한다', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(
      fetchJson('/api/test', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'VOD 조회에 실패했습니다.',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof ApiError)) return false;
      expect(err.code).toBe('VOD_FETCH_FAILED_NETWORK');
      expect(err.status).toBe(0);
      expect(err.cause).toBeInstanceOf(TypeError);
      return true;
    });
  });

  it('parse 실패: SchemaParseError를 throw한다', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { data: { wrong: true } }));
    await expect(
      fetchJson('/api/test', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'VOD 조회에 실패했습니다.',
        parse: (data) => {
          const d = data as Record<string, unknown>;
          if (!('id' in d)) throw new Error('id 필드 없음');
          return d as { id: number };
        },
      }),
    ).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof SchemaParseError)) return false;
      expect(err.code).toBe('VOD_FETCH_FAILED_PARSE');
      expect(err.context).toHaveProperty('rawSample');
      return true;
    });
  });

  it('method 대문자 정규화 확인', async () => {
    mockFetch.mockResolvedValue(makeResponse(404, {}, false));
    await expect(
      fetchJson('/api/test', {
        method: 'post',
        code: 'TEST',
        displayMessage: '테스트',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof ApiError)) return false;
      expect(err.method).toBe('POST');
      return true;
    });
  });
});

/**
 * §7.1 - Sentry startSpan 자동 wrapping 검증.
 * apps/web에서 `Sentry.startSpan`을 주입했다고 가정한 상태에서
 * 200/4xx/5xx/네트워크/파스 분기 attributes를 단언한다.
 */
describe('fetchJson + setFetchJsonStartSpan', () => {
  type CapturedSpan = {
    name: string;
    op?: string;
    attributes: Record<string, unknown>;
  };

  let captured: CapturedSpan[] = [];

  function makeStartSpan() {
    return async <T>(
      options: { name: string; op?: string; attributes?: Record<string, unknown> },
      cb: (span: unknown) => Promise<T> | T,
    ): Promise<T> => {
      const entry: CapturedSpan = {
        name: options.name,
        op: options.op,
        attributes: { ...(options.attributes ?? {}) },
      };
      captured.push(entry);
      const span = {
        setAttribute: (key: string, value: unknown) => {
          entry.attributes[key] = value;
        },
      };
      return await cb(span);
    };
  }

  beforeEach(() => {
    mockFetch.mockReset();
    captured = [];
    setFetchJsonStartSpan(makeStartSpan());
  });

  it('기본 span name=api.fetch + op=http.client + 기본 attributes', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { data: { id: 1 } }));
    await fetchJson('/api/x', {
      code: 'TEST',
      displayMessage: 'x',
      method: 'GET',
    });

    expect(captured).toHaveLength(1);
    const span = captured[0];
    expect(span.name).toBe('api.fetch');
    expect(span.op).toBe('http.client');
    expect(span.attributes['http.url']).toBe('/api/x');
    expect(span.attributes['http.method']).toBe('GET');
  });

  it('init.metric 지정 시 span name으로 사용', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { id: 1 }));
    await fetchJson('/api/y', {
      code: 'TEST',
      displayMessage: 'y',
      metric: 'vod.detail.fetch',
    });
    expect(captured[0].name).toBe('vod.detail.fetch');
  });

  it('200 분기: result=success + status_code 200 + duration_ms 부착', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { data: { id: 1 } }));
    await fetchJson('/api/z', {
      code: 'TEST',
      displayMessage: 'z',
    });

    const attr = captured[0].attributes;
    expect(attr['http.status_code']).toBe(200);
    expect(attr.result).toBe('success');
    expect(typeof attr.duration_ms).toBe('number');
    expect(attr['error.code']).toBeUndefined();
  });

  it('4xx 분기: result=http_error + error.code + status_code 부착', async () => {
    mockFetch.mockResolvedValue(makeResponse(404, { message: '없음' }, false));
    await expect(
      fetchJson('/api/x', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'x',
      }),
    ).rejects.toBeInstanceOf(ApiError);

    const attr = captured[0].attributes;
    expect(attr['http.status_code']).toBe(404);
    expect(attr.result).toBe('http_error');
    expect(attr['error.code']).toBe('VOD_FETCH_FAILED');
    expect(typeof attr.duration_ms).toBe('number');
  });

  it('5xx 분기: result=http_error + error.code + status_code 500', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, { message: '서버 오류' }, false));
    await expect(
      fetchJson('/api/x', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'x',
      }),
    ).rejects.toBeInstanceOf(ApiError);

    const attr = captured[0].attributes;
    expect(attr['http.status_code']).toBe(500);
    expect(attr.result).toBe('http_error');
    expect(attr['error.code']).toBe('VOD_FETCH_FAILED');
  });

  it('network 분기: result=network_error + error.code _NETWORK', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(
      fetchJson('/api/x', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'x',
      }),
    ).rejects.toBeInstanceOf(ApiError);

    const attr = captured[0].attributes;
    expect(attr.result).toBe('network_error');
    expect(attr['error.code']).toBe('VOD_FETCH_FAILED_NETWORK');
    // 네트워크 실패는 status_code 미부착
    expect(attr['http.status_code']).toBeUndefined();
  });

  it('parse 분기: result=parse_error + error.code _PARSE', async () => {
    mockFetch.mockResolvedValue(makeResponse(200, { data: {} }));
    await expect(
      fetchJson('/api/x', {
        code: 'VOD_FETCH_FAILED',
        displayMessage: 'x',
        parse: () => {
          throw new Error('parse fail');
        },
      }),
    ).rejects.toBeInstanceOf(SchemaParseError);

    const attr = captured[0].attributes;
    expect(attr.result).toBe('parse_error');
    expect(attr['error.code']).toBe('VOD_FETCH_FAILED_PARSE');
  });

  it('span 미주입 상태에서도 정상 동작 (no-op)', async () => {
    setFetchJsonStartSpan(undefined);
    mockFetch.mockResolvedValue(makeResponse(200, { data: { id: 1 } }));
    const result = await fetchJson<{ id: number }>('/api/x', {
      code: 'TEST',
      displayMessage: 'x',
    });
    expect(result).toEqual({ id: 1 });
    expect(captured).toHaveLength(0);
  });
});
