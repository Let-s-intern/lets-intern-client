import { extractHttpStatus, classifyNoise } from './sentry';
import { ApiError } from '@letscareer/api';

describe('extractHttpStatus', () => {
  it('ApiError(packages/api)에서 status 추출', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/123',
      method: 'GET',
    });
    expect(extractHttpStatus(err)).toBe(500);
  });

  it('axios 스타일 에러(response.status)에서 status 추출', () => {
    const err = { response: { status: 404 }, message: 'Not Found' };
    expect(extractHttpStatus(err)).toBe(404);
  });

  it('커스텀 client 스타일(err.status)에서 status 추출', () => {
    const err = { status: 403, message: 'Forbidden' };
    expect(extractHttpStatus(err)).toBe(403);
  });

  it('plain Error는 undefined 반환', () => {
    const err = new Error('plain error');
    expect(extractHttpStatus(err)).toBeUndefined();
  });

  it('null은 undefined 반환', () => {
    expect(extractHttpStatus(null)).toBeUndefined();
  });

  it('string은 undefined 반환', () => {
    expect(extractHttpStatus('error')).toBeUndefined();
  });

  it('status=0 네트워크 에러도 추출', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED_NETWORK',
      message: 'VOD 조회에 실패했습니다.',
      status: 0,
      endpoint: '/vods/123',
      method: 'GET',
    });
    expect(extractHttpStatus(err)).toBe(0);
  });
});

describe('classifyNoise', () => {
  it('parentNode TypeError → translator', () => {
    const err = new TypeError(
      "Cannot read properties of null (reading 'parentNode')",
    );
    expect(classifyNoise(err)).toBe('translator');
  });

  it('removeChild TypeError → translator', () => {
    const err = new TypeError("Failed to execute 'removeChild' on 'Node'");
    expect(classifyNoise(err)).toBe('translator');
  });

  it('insertBefore TypeError → translator', () => {
    const err = new TypeError("Failed to execute 'insertBefore' on 'Node'");
    expect(classifyNoise(err)).toBe('translator');
  });

  it('metamask 메시지 → wallet', () => {
    const err = new Error('Failed to connect to MetaMask');
    expect(classifyNoise(err)).toBe('wallet');
  });

  it('ethereum 메시지 → wallet', () => {
    const err = new Error('window.ethereum is not defined');
    expect(classifyNoise(err)).toBe('wallet');
  });

  it('ChunkLoadError → stale-deploy', () => {
    const err = new Error('Loading chunk 123 failed.');
    err.name = 'ChunkLoadError';
    expect(classifyNoise(err)).toBe('stale-deploy');
  });

  it('Failed to load chunk 메시지 → stale-deploy', () => {
    const err = new Error('Failed to load chunk /_next/static/chunks/abc.js');
    expect(classifyNoise(err)).toBe('stale-deploy');
  });

  it('일반 5xx ApiError → null', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/1',
      method: 'GET',
    });
    expect(classifyNoise(err)).toBeNull();
  });

  it('일반 TypeError(비번역기) → null', () => {
    const err = new TypeError(
      'Cannot read properties of undefined (reading x)',
    );
    expect(classifyNoise(err)).toBeNull();
  });
});
