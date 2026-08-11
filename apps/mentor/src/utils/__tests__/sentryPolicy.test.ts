import { describe, expect, it } from 'vitest';

import {
  classifyNoise,
  extractHttpStatus,
  isCrashEvent,
} from '../sentryPolicy';

describe('extractHttpStatus', () => {
  it('ApiError 형태의 status 를 읽는다', () => {
    expect(extractHttpStatus({ status: 500 })).toBe(500);
  });

  it('axios 에러의 response.status 를 읽는다', () => {
    expect(extractHttpStatus({ response: { status: 404 } })).toBe(404);
  });

  it('상태 코드가 없으면 undefined 를 준다', () => {
    expect(extractHttpStatus(new Error('네트워크 실패'))).toBeUndefined();
    expect(extractHttpStatus(null)).toBeUndefined();
    expect(extractHttpStatus('문자열')).toBeUndefined();
  });
});

describe('classifyNoise', () => {
  it('ChunkLoadError 를 stale-deploy 로 분류한다', () => {
    const error = new Error('Loading chunk 42 failed');
    error.name = 'ChunkLoadError';
    expect(classifyNoise(error)).toBe('stale-deploy');
  });

  it('동적 import 실패 메시지도 stale-deploy 로 본다', () => {
    // LC-3184 이후 lazy 청크가 늘어 이 형태가 실제로 나올 수 있다.
    expect(
      classifyNoise(
        new Error('Failed to fetch dynamically imported module: /assets/x.js'),
      ),
    ).toBe('stale-deploy');
  });

  it('일반 에러는 노이즈로 분류하지 않는다', () => {
    expect(classifyNoise(new Error('피드백 저장에 실패했습니다'))).toBeNull();
    expect(
      classifyNoise(new TypeError('Cannot read properties of undefined')),
    ).toBeNull();
  });
});

describe('isCrashEvent', () => {
  it('fatal 레벨은 크래시다', () => {
    expect(isCrashEvent({ level: 'fatal' })).toBe(true);
  });

  it('처리되지 않은 예외는 크래시다', () => {
    expect(
      isCrashEvent({
        exception: { values: [{ mechanism: { handled: false } }] },
      }),
    ).toBe(true);
  });

  it('ChunkLoadError 는 크래시다', () => {
    expect(
      isCrashEvent({ exception: { values: [{ type: 'ChunkLoadError' }] } }),
    ).toBe(true);
  });

  it('_PARSE 로 끝나는 errorCode 는 크래시다', () => {
    expect(isCrashEvent({ tags: { errorCode: 'FEEDBACK_PARSE' } })).toBe(true);
  });

  it('처리된 일반 에러는 크래시가 아니다', () => {
    expect(
      isCrashEvent({
        level: 'error',
        tags: { errorCode: 'FEEDBACK_SAVE_FAILED' },
        exception: { values: [{ mechanism: { handled: true } }] },
      }),
    ).toBe(false);
  });

  it('빈 이벤트는 크래시가 아니다', () => {
    expect(isCrashEvent({})).toBe(false);
  });
});
