import { fetchBlogData, fetchRecommendBlogData } from './blog';
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

describe('fetchBlogData', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('5xx → ApiError(code=BLOG_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(
      makeResponse(500, { message: '서버 오류' }, false),
    );
    let caught: unknown;
    try {
      await fetchBlogData('1');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.code).toBe('BLOG_FETCH_FAILED');
    expect(apiErr.status).toBe(500);
  });

  it('4xx → ApiError(code=BLOG_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(404, {}, false));
    let caught: unknown;
    try {
      await fetchBlogData('1');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.status).toBe(404);
  });
});

describe('fetchRecommendBlogData', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('5xx → ApiError(code=BLOG_RECOMMEND_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, {}, false));
    let caught: unknown;
    try {
      await fetchRecommendBlogData({ pageable: { page: 0, size: 10 } });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.code).toBe('BLOG_RECOMMEND_FETCH_FAILED');
  });
});
