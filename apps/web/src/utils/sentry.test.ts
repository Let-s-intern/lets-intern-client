import { extractHttpStatus, classifyNoise, shouldFilterError } from './sentry';
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

describe('shouldFilterError - bot user-agent', () => {
  // 봇 트래픽이 만든 BE 5xx류 에러는 사용자 영향이 0이므로 Slack 발송 차단.
  const sampleError = new Error('가이드북 상세 조회에 실패했습니다');

  it('Slackbot link unfurl → 필터링', () => {
    expect(
      shouldFilterError(
        sampleError,
        '/program/guidebook/123/foo',
        'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
      ),
    ).toBe(true);
  });

  it('KakaoTalk scrap → 필터링', () => {
    expect(
      shouldFilterError(
        sampleError,
        '/program/guidebook/123/foo',
        'Mozilla/5.0 (compatible; kakaotalk-scrap/1.0; +https://devtalk.kakao.com/...)',
      ),
    ).toBe(true);
  });

  it('Googlebot → 필터링', () => {
    expect(
      shouldFilterError(
        sampleError,
        '/program/guidebook/123/foo',
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      ),
    ).toBe(true);
  });

  it('일반 사용자 Chrome → 필터링하지 않음', () => {
    expect(
      shouldFilterError(
        sampleError,
        '/program/guidebook/123/foo',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ),
    ).toBe(false);
  });

  it('userAgent 미제공 + 일반 에러 → 필터링하지 않음', () => {
    expect(shouldFilterError(sampleError)).toBe(false);
  });
});
