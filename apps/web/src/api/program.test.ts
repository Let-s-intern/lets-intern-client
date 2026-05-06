import {
  fetchPublicVodData,
  fetchPublicGuidebookData,
  fetchLive,
} from './program';
import { ApiError } from '@letscareer/api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeResponse(status: number, body: unknown, ok?: boolean): Response {
  const isOk = ok !== undefined ? ok : status >= 200 && status < 300;
  return {
    ok: isOk,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response;
}

describe('fetchPublicVodData', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('200 → 정상 파싱된 데이터 반환', async () => {
    const vodData = {
      id: 1,
      title: 'VOD 제목',
      thumbnail: 'https://example.com/thumb.jpg',
      shortDesc: '짧은 설명',
      programType: 'VOD',
      startDate: null,
      endDate: null,
      recruitStartDate: null,
      recruitEndDate: null,
    };
    mockFetch.mockResolvedValue(makeResponse(200, { data: vodData }));
    const result = await fetchPublicVodData('1');
    expect(result).toMatchObject({ id: 1, title: 'VOD 제목' });
  });

  it('5xx → ApiError(status=500, code=VOD_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(
      makeResponse(500, { message: '서버 오류' }, false),
    );
    let caught: unknown;
    try {
      await fetchPublicVodData('1');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.status).toBe(500);
    expect(apiErr.code).toBe('VOD_FETCH_FAILED');
  });
});

describe('fetchPublicGuidebookData', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('200 → 정상 파싱된 데이터 반환', async () => {
    const guidebookData = {
      id: 2,
      title: '가이드북 제목',
      thumbnail: null,
      shortDesc: '가이드북 설명',
      programType: 'GUIDEBOOK',
      startDate: null,
      endDate: null,
      recruitStartDate: null,
      recruitEndDate: null,
    };
    mockFetch.mockResolvedValue(makeResponse(200, { data: guidebookData }));
    const result = await fetchPublicGuidebookData('2');
    expect(result).toMatchObject({ id: 2, title: '가이드북 제목' });
  });

  it('5xx → ApiError(status=500, code=GUIDEBOOK_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, {}, false));
    let caught: unknown;
    try {
      await fetchPublicGuidebookData('2');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.status).toBe(500);
    expect(apiErr.code).toBe('GUIDEBOOK_FETCH_FAILED');
  });
});

describe('fetchLive', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://api.example.com';
  });

  it('5xx → ApiError(code=LIVE_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, {}, false));
    let caught: unknown;
    try {
      await fetchLive('3');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.code).toBe('LIVE_FETCH_FAILED');
  });
});
