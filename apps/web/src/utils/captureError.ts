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
