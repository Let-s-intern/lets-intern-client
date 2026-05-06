import { fetchReport, fetchReportId } from './report';
import { ApiError, AppError } from '@letscareer/api';

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

describe('fetchReport', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('5xx → ApiError(code=REPORT_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, {}, false));
    let caught: unknown;
    try {
      await fetchReport({ type: 'RESUME' });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.code).toBe('REPORT_FETCH_FAILED');
  });

  it('알 수 없는 type → AppError(code=REPORT_INVALID_TYPE) throw', async () => {
    mockFetch.mockResolvedValue(
      makeResponse(200, {
        data: {
          resumeInfoList: [],
          portfolioInfoList: [],
          personalStatementInfoList: [],
        },
      }),
    );
    let caught: unknown;
    try {
      await fetchReport({ type: 'UNKNOWN' as never });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(AppError);
    const appErr = caught as AppError;
    expect(appErr.code).toBe('REPORT_INVALID_TYPE');
  });
});

describe('fetchReportId', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_SERVER_API = 'https://api.example.com/v1';
  });

  it('5xx → ApiError(code=REPORT_FETCH_FAILED) throw', async () => {
    mockFetch.mockResolvedValue(makeResponse(500, {}, false));
    let caught: unknown;
    try {
      await fetchReportId('1');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.code).toBe('REPORT_FETCH_FAILED');
  });
});
