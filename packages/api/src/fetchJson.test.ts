import { fetchJson } from './fetchJson';
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
