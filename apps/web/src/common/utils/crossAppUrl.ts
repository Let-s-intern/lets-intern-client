/**
 * web → admin/mentor 서브도메인으로 이동할 때 사용.
 * 로그인 상태면 localStorage의 토큰을 URL hash로 전달해 자동 로그인 유도.
 * 수신 측(admin/mentor)은 packages/store의 consumeSsoHashIfPresent가 파싱.
 *
 * baseUrl이 없으면 (env 미설정) `prefix + subPath`를 반환해 web의 자체 admin/mentor 라우트로 fallback.
 */
export function buildCrossAppUrl(
  baseUrl: string | undefined,
  prefix: string,
  subPath: string = '/',
): string {
  if (!baseUrl) {
    const normalizedPrefix = prefix.replace(/\/$/, '');
    const normalizedSub = subPath.startsWith('/') ? subPath : `/${subPath}`;
    return normalizedPrefix + normalizedSub;
  }

  try {
    const target = new URL(subPath, baseUrl);

    if (typeof window === 'undefined') return target.toString();

    const raw = window.localStorage.getItem('userLoginStatus');
    if (!raw) return target.toString();

    const parsed = JSON.parse(raw) as {
      state?: { accessToken?: string; refreshToken?: string };
    };
    const accessToken = parsed?.state?.accessToken;
    const refreshToken = parsed?.state?.refreshToken;
    if (!accessToken || !refreshToken) return target.toString();

    target.hash = `__sso=${encodeURIComponent(`${accessToken}|${refreshToken}`)}`;
    return target.toString();
  } catch {
    return (
      baseUrl.replace(/\/$/, '') +
      (subPath.startsWith('/') ? subPath : `/${subPath}`)
    );
  }
}
