/**
 * web → admin/mentor 서브도메인(또는 로컬 포트)으로 이동할 때 사용.
 * 로그인 상태면 localStorage의 토큰을 URL hash로 전달해 자동 로그인 유도.
 * 수신 측(admin/mentor)은 packages/store의 consumeSsoHashIfPresent가 파싱.
 *
 * baseUrl이 없으면 (env 미설정) 원래 path 반환 — middleware가 308로 처리.
 */
export function buildCrossAppUrl(
  baseUrl: string | undefined,
  path: string = '/',
): string {
  if (!baseUrl) return path;

  try {
    const target = new URL(path, baseUrl);

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
    return baseUrl.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`);
  }
}
