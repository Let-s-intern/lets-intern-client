import { AppError, ApiError, SchemaParseError } from '@letscareer/api';

type CapturedSpan = {
  name: string;
  op?: string;
  attributes: Record<string, unknown>;
};

const capturedSpans: CapturedSpan[] = [];

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  getReplay: jest.fn(() => undefined),
  startSpan: jest.fn(
    (
      options: {
        name: string;
        op?: string;
        attributes?: Record<string, unknown>;
      },
      cb: (span: unknown) => unknown,
    ) => {
      capturedSpans.push({
        name: options.name,
        op: options.op,
        attributes: { ...(options.attributes ?? {}) },
      });
      return cb({
        setAttribute: () => {},
      });
    },
  ),
}));

const mockReplayFlushed = jest.fn();
jest.mock('./log', () => ({
  replayFlushed: (...args: unknown[]) => mockReplayFlushed(...args),
}));

import { captureDomainError, captureVodError } from './captureError';

import * as Sentry from '@sentry/nextjs';

const mockCaptureException = Sentry.captureException as jest.MockedFunction<
  typeof Sentry.captureException
>;

describe('captureDomainError', () => {
  beforeEach(() => {
    mockCaptureException.mockClear();
    capturedSpans.length = 0;
  });

  it('5xx ApiError → level: warning', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/123',
      method: 'GET',
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    expect(mockCaptureException).toHaveBeenCalledWith(
      err,
      expect.objectContaining({ level: 'warning' }),
    );
  });

  it('4xx ApiError → level: error', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 404,
      endpoint: '/vods/123',
      method: 'GET',
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    expect(mockCaptureException).toHaveBeenCalledWith(
      err,
      expect.objectContaining({ level: 'error' }),
    );
  });

  it('ApiError context가 extra에 자동 부착된다', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/123',
      method: 'GET',
      serverMessage: '서버 에러',
      context: { requestId: 'abc123' },
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      extra: Record<string, unknown>;
    };
    expect(callArgs.extra).toMatchObject({
      requestId: 'abc123',
      endpoint: '/vods/123',
      method: 'GET',
      serverMessage: '서버 에러',
    });
  });

  it('fingerprint이 [domain, section, code, status]로 고정된다', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/456',
      method: 'GET',
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      fingerprint: string[];
    };
    expect(callArgs.fingerprint).toEqual([
      'vod',
      'fetchPublicVodData',
      'VOD_FETCH_FAILED',
      '500',
    ]);
  });

  it('동일 도메인/섹션/코드/status는 항상 동일한 fingerprint (안정성)', () => {
    const makeErr = (vodId: string) =>
      new ApiError({
        code: 'VOD_FETCH_FAILED',
        message: 'VOD 조회에 실패했습니다.',
        status: 500,
        endpoint: `/vods/${vodId}`,
        method: 'GET',
      });

    captureDomainError(makeErr('111'), {
      domain: 'vod',
      section: 'fetchPublicVodData',
    });
    captureDomainError(makeErr('999'), {
      domain: 'vod',
      section: 'fetchPublicVodData',
    });

    const fp1 = (mockCaptureException.mock.calls[0][1] as { fingerprint: string[] })
      .fingerprint;
    const fp2 = (mockCaptureException.mock.calls[1][1] as { fingerprint: string[] })
      .fingerprint;
    expect(fp1).toEqual(fp2);
  });

  it('plain Error → level: error, fingerprint에 code=unknown', () => {
    const err = new Error('알 수 없는 에러');

    captureDomainError(err, { domain: 'common', section: 'unknown' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      level: string;
      fingerprint: string[];
    };
    expect(callArgs.level).toBe('error');
    expect(callArgs.fingerprint).toEqual(['common', 'unknown', 'unknown', '0']);
  });

  it('captureVodError는 domain=vod로 자동 설정', () => {
    const err = new Error('vod error');
    captureVodError(err, { section: 'fetchPublicVodData' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      tags: Record<string, string>;
    };
    expect(callArgs.tags.domain).toBe('vod');
  });

  it('활성 replay가 있으면 replayId tag 부착', () => {
    const mockGetReplay = Sentry.getReplay as jest.MockedFunction<typeof Sentry.getReplay>;
    mockGetReplay.mockReturnValue({
      getReplayId: () => 'replay-abc123',
    } as unknown as ReturnType<typeof Sentry.getReplay>);

    const err = new Error('에러');
    captureDomainError(err, { domain: 'vod', section: 'test' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      tags: Record<string, string>;
    };
    expect(callArgs.tags.replayId).toBe('replay-abc123');

    // 원상 복구
    mockGetReplay.mockReturnValue(undefined);
  });

  it('replay가 없으면 replayId tag 미부착', () => {
    const mockGetReplay = Sentry.getReplay as jest.MockedFunction<typeof Sentry.getReplay>;
    mockGetReplay.mockReturnValue(undefined);

    const err = new Error('에러');
    captureDomainError(err, { domain: 'vod', section: 'test' });

    const callArgs = mockCaptureException.mock.calls[0][1] as {
      tags: Record<string, unknown>;
    };
    expect(callArgs.tags.replayId).toBeUndefined();
  });
});

describe('captureDomainError → replay.crash op span (§7.3)', () => {
  beforeEach(() => {
    mockCaptureException.mockClear();
    mockReplayFlushed.mockClear();
    capturedSpans.length = 0;
  });

  it('SchemaParseError(_PARSE) → replay.crash emit + domain/errorCode attr', () => {
    const err = new SchemaParseError({
      code: 'VOD_FETCH_FAILED_PARSE',
      message: 'VOD 조회에 실패했습니다.',
      status: 200,
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    expect(capturedSpans).toHaveLength(1);
    const span = capturedSpans[0];
    expect(span.name).toBe('replay.crash');
    expect(span.op).toBe('app.crash');
    expect(span.attributes.domain).toBe('vod');
    expect(span.attributes.errorCode).toBe('VOD_FETCH_FAILED_PARSE');
  });

  it('§8.5.4 — crash 분류 시 replayFlushed(replayId, errorCode) 호출', () => {
    const mockGetReplay = Sentry.getReplay as jest.MockedFunction<
      typeof Sentry.getReplay
    >;
    mockGetReplay.mockReturnValue({
      getReplayId: () => 'replay-xyz',
    } as unknown as ReturnType<typeof Sentry.getReplay>);

    const err = new SchemaParseError({
      code: 'BLOG_FETCH_FAILED_PARSE',
      message: 'x',
      status: 200,
    });
    captureDomainError(err, { domain: 'blog', section: 'fetchBlog' });

    expect(mockReplayFlushed).toHaveBeenCalledTimes(1);
    expect(mockReplayFlushed).toHaveBeenCalledWith(
      'replay-xyz',
      'BLOG_FETCH_FAILED_PARSE',
    );

    mockGetReplay.mockReturnValue(undefined);
  });

  it('§8.5.4 — crash 아님 → replayFlushed 미호출', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'x',
      status: 500,
      endpoint: '/x',
      method: 'GET',
    });
    captureDomainError(err, { domain: 'vod', section: 'fetchVod' });
    expect(mockReplayFlushed).not.toHaveBeenCalled();
  });

  it('ChunkLoadError → replay.crash emit', () => {
    const err = new Error('Loading chunk 123 failed');
    err.name = 'ChunkLoadError';

    captureDomainError(err, { domain: 'common', section: 'navigation' });

    expect(capturedSpans).toHaveLength(1);
    const span = capturedSpans[0];
    expect(span.name).toBe('replay.crash');
    expect(span.attributes.domain).toBe('common');
    // ChunkLoadError는 AppError 아님 → errorCode 미부착
    expect(span.attributes.errorCode).toBeUndefined();
  });

  it('일반 4xx ApiError → replay.crash emit 안 함', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 404,
      endpoint: '/vods/1',
      method: 'GET',
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    expect(capturedSpans).toHaveLength(0);
  });

  it('일반 5xx ApiError → replay.crash emit 안 함', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/1',
      method: 'GET',
    });

    captureDomainError(err, { domain: 'vod', section: 'fetchPublicVodData' });

    expect(capturedSpans).toHaveLength(0);
  });

  it('plain Error → replay.crash emit 안 함', () => {
    captureDomainError(new Error('알 수 없는 에러'), {
      domain: 'common',
      section: 'unknown',
    });
    expect(capturedSpans).toHaveLength(0);
  });
});
