/**
 * Notion 임베드 URL 화이트리스트 유틸 (web - 본문 렌더 측).
 *
 * apps/admin 측과 동일 로직. 현 시점에서는 변경 격리를 위해 복제하며,
 * 추후 공통 패키지로 승격 시 함께 옮긴다.
 */

const ALLOWED_NOTION_HOSTS = new Set([
  'letsintern.notion.site',
  'www.notion.so',
]);

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

  return ALLOWED_NOTION_HOSTS.has(parsed.host);
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
