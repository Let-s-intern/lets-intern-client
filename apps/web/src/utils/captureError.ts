import * as Sentry from '@sentry/nextjs';
import { AppError, ApiError } from '@letscareer/api';
import { extractHttpStatus } from './sentry';

export type Domain =
  | 'auth'
  | 'blog'
  | 'challenge'
  | 'guidebook'
  | 'vod'
  | 'common';

function buildFingerprint(opts: {
  domain: Domain;
  section: string;
  code: string | undefined;
  status: number | undefined;
}): string[] {
  return [
    opts.domain,
    opts.section,
    opts.code ?? 'unknown',
    String(opts.status ?? '0'),
  ];
}

/**
 * §7.3 — captureDomainError가 받은 에러가 'crash' 분류인지 판정한다.
 * `isCrashEvent`(replayCrashFilter)와 동일한 기준 중, raw error에서 추론 가능한
 * 두 가지를 적용:
 *  - err.name === 'ChunkLoadError' (stale-deploy)
 *  - error.code가 '_PARSE'로 끝남 (Schema parse 실패)
 */
function isCrashError(err: unknown, code: string | undefined): boolean {
  if (typeof code === 'string' && code.endsWith('_PARSE')) return true;
  if (err instanceof Error && err.name === 'ChunkLoadError') return true;
  return false;
}

export function captureDomainError(
  err: unknown,
  opts: {
    domain: Domain;
    section: string;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
  },
) {
  const { domain, section, extra, tags } = opts;
  const status = extractHttpStatus(err);
  const isServerFault = typeof status === 'number' && status >= 500;
  const code = err instanceof AppError ? err.code : undefined;

  const replayId = Sentry.getReplay?.()?.getReplayId?.();

  Sentry.captureException(err, {
    level: isServerFault ? 'warning' : 'error',
    tags: {
      domain,
      section,
      ...(code && { errorCode: code }),
      ...(typeof status === 'number' && { httpStatus: String(status) }),
      ...(replayId && { replayId }),
      ...tags,
    },
    extra: {
      ...(err instanceof AppError ? err.context : undefined),
      ...(err instanceof ApiError && {
        endpoint: err.endpoint,
        method: err.method,
        serverMessage: err.serverMessage,
      }),
      ...extra,
    },
    fingerprint: buildFingerprint({ domain, section, code, status }),
  });

  // §7.3 — crash로 분류된 경우 'replay.crash' op span 1회 emit (KPI 카운터)
  if (isCrashError(err, code)) {
    Sentry.startSpan(
      {
        name: 'replay.crash',
        op: 'app.crash',
        attributes: {
          domain,
          ...(code !== undefined && { errorCode: code }),
        },
      },
      () => {},
    );
  }
}

export const captureBlogError = (
  err: unknown,
  opts: Omit<Parameters<typeof captureDomainError>[1], 'domain'>,
) => captureDomainError(err, { ...opts, domain: 'blog' });

export const captureVodError = (
  err: unknown,
  opts: Omit<Parameters<typeof captureDomainError>[1], 'domain'>,
) => captureDomainError(err, { ...opts, domain: 'vod' });

export const captureGuidebookError = (
  err: unknown,
  opts: Omit<Parameters<typeof captureDomainError>[1], 'domain'>,
) => captureDomainError(err, { ...opts, domain: 'guidebook' });

export const captureChallengeError = (
  err: unknown,
  opts: Omit<Parameters<typeof captureDomainError>[1], 'domain'>,
) => captureDomainError(err, { ...opts, domain: 'challenge' });

export const captureAuthError = (
  err: unknown,
  opts: Omit<Parameters<typeof captureDomainError>[1], 'domain'>,
) => captureDomainError(err, { ...opts, domain: 'auth' });
