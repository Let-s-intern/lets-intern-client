/**
 * §8.1.T1 — utils/log.ts wrapper 단위 테스트.
 * 각 wrapper가 정확한 level + attributes 로 emit 되는지 확인한다.
 */
const mockTrace = jest.fn();
const mockDebug = jest.fn();
const mockInfo = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();
const mockFatal = jest.fn();

jest.mock('@sentry/nextjs', () => ({
  logger: {
    trace: (...args: unknown[]) => mockTrace(...args),
    debug: (...args: unknown[]) => mockDebug(...args),
    info: (...args: unknown[]) => mockInfo(...args),
    warn: (...args: unknown[]) => mockWarn(...args),
    error: (...args: unknown[]) => mockError(...args),
    fatal: (...args: unknown[]) => mockFatal(...args),
  },
}));

import {
  apiSlow,
  apiClientError,
  apiServerError,
  signinSuccess,
  signinReject,
  socialCallbackError,
  staleChunkReload,
  rscRenderFailed,
  replayFlushed,
} from './log';

describe('utils/log wrapper', () => {
  beforeEach(() => {
    mockTrace.mockClear();
    mockDebug.mockClear();
    mockInfo.mockClear();
    mockWarn.mockClear();
    mockError.mockClear();
    mockFatal.mockClear();
  });

  it('apiSlow: warn level + method/url/durationMs 부착', () => {
    apiSlow('GET', '/api/x', 1234);
    expect(mockWarn).toHaveBeenCalledTimes(1);
    expect(mockWarn).toHaveBeenCalledWith('api.slow', {
      method: 'GET',
      url: '/api/x',
      durationMs: 1234,
    });
  });

  it('apiClientError: warn level + method/url/status/errorCode 부착', () => {
    apiClientError('POST', '/api/y', 404, 'VOD_FETCH_FAILED');
    expect(mockWarn).toHaveBeenCalledTimes(1);
    expect(mockWarn).toHaveBeenCalledWith('api.client_error', {
      method: 'POST',
      url: '/api/y',
      status: 404,
      errorCode: 'VOD_FETCH_FAILED',
    });
  });

  it('apiServerError: error level + method/url/status/errorCode 부착', () => {
    apiServerError('GET', '/api/z', 500, 'BLOG_FETCH_FAILED');
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledWith('api.server_error', {
      method: 'GET',
      url: '/api/z',
      status: 500,
      errorCode: 'BLOG_FETCH_FAILED',
    });
  });

  it('signinSuccess: info level + method/userIdHash 부착', () => {
    signinSuccess('password', 'abcd1234');
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith('auth.signin.success', {
      method: 'password',
      userIdHash: 'abcd1234',
    });
  });

  it('signinReject: warn level + method/reason/status 부착', () => {
    signinReject('password', 'invalid_credentials', 401);
    expect(mockWarn).toHaveBeenCalledTimes(1);
    expect(mockWarn).toHaveBeenCalledWith('auth.signin.reject', {
      method: 'password',
      reason: 'invalid_credentials',
      status: 401,
    });
  });

  it('signinReject: status undefined 시 attribute 미부착', () => {
    signinReject('password', 'no_response', undefined);
    expect(mockWarn).toHaveBeenCalledWith('auth.signin.reject', {
      method: 'password',
      reason: 'no_response',
    });
  });

  it('socialCallbackError: error level + provider/errorCode 부착', () => {
    socialCallbackError('kakao', 'duplicate_phone');
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledWith('auth.social.callback_error', {
      provider: 'kakao',
      errorCode: 'duplicate_phone',
    });
  });

  it('staleChunkReload: info level + chunkUrl 부착', () => {
    staleChunkReload('/_next/static/chunks/abc.js');
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith('app.stale_chunk_reload', {
      chunkUrl: '/_next/static/chunks/abc.js',
    });
  });

  it('rscRenderFailed: error level + digest/route 부착', () => {
    rscRenderFailed('digest123', '/program/vod/1');
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledWith('app.rsc_render_failed', {
      digest: 'digest123',
      route: '/program/vod/1',
    });
  });

  it('rscRenderFailed: digest/route undefined 시 attribute 미부착', () => {
    rscRenderFailed(undefined, undefined);
    expect(mockError).toHaveBeenCalledWith('app.rsc_render_failed', {});
  });

  it('replayFlushed: info level + replayId/errorCode 부착', () => {
    replayFlushed('replay-abc', 'VOD_FETCH_FAILED_PARSE');
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith('replay.flushed', {
      replayId: 'replay-abc',
      errorCode: 'VOD_FETCH_FAILED_PARSE',
    });
  });

  it('replayFlushed: replayId/errorCode undefined 시 attribute 미부착', () => {
    replayFlushed(undefined, undefined);
    expect(mockInfo).toHaveBeenCalledWith('replay.flushed', {});
  });
});
