import { AppError, ApiError } from '@letscareer/api';
import * as Sentry from '@sentry/react';

import { extractHttpStatus } from './sentryPolicy';

/**
 * 에러가 발생한 화면 영역. `router.tsx` 의 라우트 구성과 맞춘다.
 * 새 라우트를 추가하면 여기도 같이 늘린다.
 */
export type MentorDomain =
  | 'schedule'
  | 'feedback'
  | 'challenge'
  | 'notice'
  | 'profile'
  | 'auth'
  | 'common';

interface CaptureOptions {
  /** 에러가 난 함수·섹션 이름. 예: `submitWrittenFeedback` */
  section: string;
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
}

/**
 * fingerprint 를 `[domain, section, errorCode, httpStatus]` 로 고정한다.
 *
 * 같은 화면·같은 원인이면 식별자(missionId, attendanceId 등)가 달라도 한 이슈로 묶이고,
 * 같은 화면이라도 404 와 500 은 원인이 다르므로 갈라진다. 동적 식별자는 `extra` 로만
 * 넘겨야 그룹이 잘게 쪼개지지 않는다.
 */
function buildFingerprint(
  domain: MentorDomain,
  section: string,
  code: string | undefined,
  status: number | undefined,
): string[] {
  return [domain, section, code ?? 'unknown', String(status ?? '0')];
}

/**
 * 도메인 컨텍스트를 붙여 에러를 Sentry 로 보낸다.
 *
 * 5xx 는 `warning`, 그 외는 `error` 로 분류한다. 서버 장애는 프론트가 고칠 수 없는
 * 사안이라 같은 심각도로 쌓이면 우리 쪽 결함이 묻힌다.
 */
export function captureDomainError(
  err: unknown,
  opts: CaptureOptions & { domain: MentorDomain },
): void {
  const { domain, section, extra, tags } = opts;
  const status = extractHttpStatus(err);
  const code = err instanceof AppError ? err.code : undefined;
  const isServerFault = typeof status === 'number' && status >= 500;

  Sentry.captureException(err, {
    level: isServerFault ? 'warning' : 'error',
    tags: {
      domain,
      section,
      ...(code && { errorCode: code }),
      ...(typeof status === 'number' && { httpStatus: String(status) }),
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
    fingerprint: buildFingerprint(domain, section, code, status),
  });
}

const withDomain =
  (domain: MentorDomain) => (err: unknown, opts: CaptureOptions) =>
    captureDomainError(err, { ...opts, domain });

export const captureScheduleError = withDomain('schedule');
export const captureFeedbackError = withDomain('feedback');
export const captureChallengeError = withDomain('challenge');
export const captureNoticeError = withDomain('notice');
export const captureProfileError = withDomain('profile');
export const captureAuthError = withDomain('auth');
export const captureCommonError = withDomain('common');
