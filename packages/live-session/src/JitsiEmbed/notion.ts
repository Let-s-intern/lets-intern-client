/**
 * Notion 임베드 URL 화이트리스트 유틸 (packages/ui — 라이브 피드백 자료 패널 전용).
 *
 * apps/web·apps/admin 의 `common/lexical/utils/notion.ts` 와 동일 로직을 승격한 것.
 * (web 유틸 주석에 "추후 공통 패키지로 승격 시 함께 옮긴다"고 명시돼 있던 대상)
 *
 * 노션 공개(publish) 페이지는 워크스페이스마다 서브도메인이 달라 `*.notion.site` 를 허용한다.
 * `www.notion.so` 는 노션이 iframe 을 차단하므로 제외.
 */

/**
 * host 가 노션 publish 도메인(`<workspace>.notion.site`) 인지 검사.
 * `.notion.site` 로 끝나되 서브도메인이 있는 경우만 매치 → 위조 도메인·서브도메인 없는 경우 방어.
 */
function isNotionPublishHost(host: string): boolean {
  return host.endsWith('.notion.site') && host.length > '.notion.site'.length;
}

export function isAllowedNotionUrl(url?: string | null): boolean {
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

const NOTION_PAGE_ID_RE =
  /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/** 노션 publish URL 을 iframe 임베드용 URL(`/ebd/<page-id>`) 로 변환. 실패 시 null. */
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
