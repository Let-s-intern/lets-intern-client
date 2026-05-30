/**
 * Open Redirect 방어 — 같은 출처 상대 경로만 허용한다.
 * `//host`(protocol-relative)나 `/\host` 처럼 외부 도메인으로 보내질 수 있는
 * 입력은 안전 기본값 `/`로 대체. `data:`/`javascript:` 등 스킴은 `/`로 시작하지
 * 않아 자동 차단된다.
 */
export function sanitizeRedirect(raw: string | null): string {
  const candidate = raw ?? '/';
  const isSafeRelativePath =
    candidate.startsWith('/') &&
    !candidate.startsWith('//') &&
    !candidate.startsWith('/\\');
  return isSafeRelativePath ? candidate : '/';
}
