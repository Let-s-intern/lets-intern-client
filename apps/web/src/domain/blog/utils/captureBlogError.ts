import * as Sentry from '@sentry/nextjs';

/**
 * 블로그 도메인의 catch된 에러를 Sentry로 보고한다.
 * 5xx(백엔드 의존성 장애)는 warning, 그 외는 error level로 분류해
 * 프론트엔드 코드 버그와 외부 장애의 alert 정책을 분리한다.
 */
export function captureBlogError(
  err: unknown,
  options: {
    section: string;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
  },
) {
  const { section, extra, tags } = options;
  const status = (err as { status?: number })?.status;
  const isServerFault = typeof status === 'number' && status >= 500;

  Sentry.captureException(err, {
    level: isServerFault ? 'warning' : 'error',
    tags: {
      section,
      ...(typeof status === 'number' && { httpStatus: String(status) }),
      ...tags,
    },
    extra,
  });
}
