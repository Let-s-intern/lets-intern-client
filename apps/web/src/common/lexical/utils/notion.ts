/**
 * Notion 임베드 URL 화이트리스트 유틸 (web - 본문 렌더 측).
 *
 * apps/admin 측과 동일 로직. 현 시점에서는 변경 격리를 위해 복제하며,
 * 추후 공통 패키지로 승격 시 함께 옮긴다.
 *
 * 노션의 공개(publish) 페이지는 워크스페이스마다 서브도메인이 다르므로
 * `*.notion.site` 패턴을 허용한다. `www.notion.so` 는 노션 측이 iframe 을 차단하므로 제거.
 */

/**
 * host 가 노션의 publish 도메인(`<workspace>.notion.site`) 인지 검사한다.
 *
 * - `endsWith('.notion.site')` 로 점이 앞에 붙은 경우만 매치 → `notion-site.com`,
 *   `evilnotion.site` 같은 위조 도메인 방어.
 * - `host.length > '.notion.site'.length` 로 정확히 `notion.site` (서브도메인 없음) 거부.
 */
function isNotionPublishHost(host: string): boolean {
  return host.endsWith('.notion.site') && host.length > '.notion.site'.length;
}

export function isAllowedNotionUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length === 0) {
    return false;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') {
    return false;
  }

  return isNotionPublishHost(parsed.host);
}

export function parseNotionUrl(text: string): string | null {
  if (typeof text !== 'string') {
    return null;
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return isAllowedNotionUrl(trimmed) ? trimmed : null;
}

const NOTION_PAGE_ID_RE =
  /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/**
 * 노션 publish URL 을 iframe 임베드용 URL(`/ebd/<page-id>`) 로 변환한다.
 * admin/web 동일 로직. apps/admin/src/common/lexical/utils/notion.ts 참조.
 */
export function toNotionEmbedUrl(url: string): string | null {
  if (!isAllowedNotionUrl(url)) {
    return null;
  }

  const parsed = new URL(url);

  if (parsed.pathname.startsWith('/ebd/')) {
    return `${parsed.origin}${parsed.pathname}`;
  }

  const match = parsed.pathname.match(NOTION_PAGE_ID_RE);
  if (match === null) {
    return null;
  }

  const id = match[1].replace(/-/g, '').toLowerCase();
  return `${parsed.origin}/ebd/${id}`;
}
