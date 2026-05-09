import * as Sentry from '@sentry/nextjs';

/**
 * §7.2 — 패스워드 로그인 mutationFn을 'auth.signin' op span으로 감싼다.
 * 성공/실패 분기 모두 `auth.result`, `auth.duration_ms` attribute를 부착한다.
 */
export function runPasswordSigninSpan<T>(login: () => Promise<T>): Promise<T> {
  return Sentry.startSpan(
    {
      name: 'auth.signin',
      op: 'auth',
      attributes: { 'auth.method': 'password' },
    },
    async (span) => {
      const startedAt = Date.now();
      try {
        const result = await login();
        span?.setAttribute('auth.result', 'success');
        span?.setAttribute('auth.duration_ms', Date.now() - startedAt);
        return result;
      } catch (err) {
        span?.setAttribute('auth.result', 'fail');
        span?.setAttribute('auth.duration_ms', Date.now() - startedAt);
        throw err;
      }
    },
  );
}

/**
 * §7.2 — 소셜 로그인 콜백 분기에서 'auth.signin' op span을 1회 emit.
 * 콜백은 단일 시점 이벤트라 duration은 의미 없으므로 attribute에서 제외.
 */
export function emitSocialSigninSpan(opts: {
  result: 'success' | 'fail';
  provider?: string;
  reason?: string;
}): void {
  Sentry.startSpan(
    {
      name: 'auth.signin',
      op: 'auth',
      attributes: {
        'auth.method': 'social',
        'auth.result': opts.result,
        ...(opts.provider !== undefined && { provider: opts.provider }),
        ...(opts.reason !== undefined && { reason: opts.reason }),
      },
    },
    () => {},
  );
}
