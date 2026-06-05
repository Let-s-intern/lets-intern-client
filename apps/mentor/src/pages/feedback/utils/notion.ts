/**
 * 노션 링크 여부 판별 — 노션만 모달 왼쪽 패널에 iframe 임베드를 시도한다.
 * (notion.so 워크스페이스 공유 / notion.site 퍼블리시 / app.notion.com 새 공유 형식)
 */
export function isNotionUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return (
      hostname === 'notion.so' ||
      hostname === 'notion.com' ||
      hostname.endsWith('.notion.so') ||
      hostname.endsWith('.notion.com') ||
      hostname.endsWith('.notion.site')
    );
  } catch {
    return false;
  }
}

/**
 * 노션 퍼블리시 링크를 공식 임베드 URL(`/ebd/<pageId>`)로 변환한다.
 *
 * 일반 노션 페이지는 frame-ancestors로 iframe을 차단하지만,
 * `https://<workspace>.notion.site/ebd/<pageId>` 임베드 경로는
 * `frame-ancestors https: http:`로 모든 사이트에서 임베드를 허용한다.
 *
 * notion.so / app.notion.com 링크는 워크스페이스의 notion.site 호스트를
 * 알 수 없어 변환 불가 → null (원본 임베드 시도 후 차단 안내로 폴백).
 */
export function toNotionEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith('.notion.site')) return null;
    if (pathname.startsWith('/ebd/')) return url;

    // 경로 마지막 세그먼트에서 32자리 hex pageId 추출 ("slug-<id>"/UUID 하이픈 허용)
    const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
    const match = lastSegment.replace(/-/g, '').match(/[0-9a-f]{32}$/i);
    if (!match) return null;

    return `https://${hostname}/ebd/${match[0]}`;
  } catch {
    return null;
  }
}
