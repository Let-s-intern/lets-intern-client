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
  const status = extractHttpStatus(err);
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

/**
 * 다양한 에러 객체 shape에서 HTTP status를 정규화 추출.
 * - 커스텀 client(`utils/client.ts`): `err.status`
 * - axios: `err.response.status`
 * - native fetch + plain Error throw: status 미보존 (undefined 반환)
 */
function extractHttpStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const e = err as { status?: unknown; response?: { status?: unknown } };
  if (typeof e.status === 'number') return e.status;
  if (typeof e.response?.status === 'number') return e.response.status;
  return undefined;
}
