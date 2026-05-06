import { isCrashEvent } from './replayCrashFilter';
import type * as Sentry from '@sentry/nextjs';

type SentryEvent = Sentry.Event;

function makeEvent(overrides: Partial<SentryEvent> = {}): SentryEvent {
  return {
    ...overrides,
  };
}

describe('isCrashEvent', () => {
  it('level=fatal → true', () => {
    expect(isCrashEvent(makeEvent({ level: 'fatal' }))).toBe(true);
  });

  it('mechanism.handled=false → true (unhandled exception)', () => {
    expect(
      isCrashEvent(
        makeEvent({
          exception: {
            values: [{ mechanism: { handled: false, type: 'onerror' } }],
          },
        }),
      ),
    ).toBe(true);
  });

  it('mechanism.handled=true → false (handled exception)', () => {
    expect(
      isCrashEvent(
        makeEvent({
          exception: {
            values: [{ mechanism: { handled: true, type: 'generic' } }],
          },
        }),
      ),
    ).toBe(false);
  });

  it('tags.kind=server-component → true', () => {
    expect(
      isCrashEvent(makeEvent({ tags: { kind: 'server-component' } })),
    ).toBe(true);
  });

  it('exception.type=ChunkLoadError → true', () => {
    expect(
      isCrashEvent(
        makeEvent({
          exception: { values: [{ type: 'ChunkLoadError' }] },
        }),
      ),
    ).toBe(true);
  });

  it('errorCode ending with _PARSE → true', () => {
    expect(
      isCrashEvent(
        makeEvent({ tags: { errorCode: 'VOD_FETCH_FAILED_PARSE' } }),
      ),
    ).toBe(true);
  });

  it('errorCode ending with _PARSE (blog) → true', () => {
    expect(
      isCrashEvent(
        makeEvent({ tags: { errorCode: 'BLOG_FETCH_FAILED_PARSE' } }),
      ),
    ).toBe(true);
  });

  it('일반 4xx ApiError (level=error) → false', () => {
    expect(
      isCrashEvent(
        makeEvent({
          level: 'error',
          tags: {
            domain: 'vod',
            httpStatus: '404',
            errorCode: 'VOD_FETCH_FAILED',
          },
          exception: {
            values: [{ mechanism: { handled: true, type: 'generic' } }],
          },
        }),
      ),
    ).toBe(false);
  });

  it('BE 5xx warning → false', () => {
    expect(
      isCrashEvent(
        makeEvent({
          level: 'warning',
          tags: {
            domain: 'vod',
            httpStatus: '500',
            errorCode: 'VOD_FETCH_FAILED',
          },
        }),
      ),
    ).toBe(false);
  });

  it('errorCode 없이 일반 에러 → false', () => {
    expect(isCrashEvent(makeEvent({ level: 'error' }))).toBe(false);
  });

  it('errorCode가 _PARSE로 끝나지 않으면 false', () => {
    expect(
      isCrashEvent(makeEvent({ tags: { errorCode: 'VOD_FETCH_FAILED' } })),
    ).toBe(false);
  });
});
