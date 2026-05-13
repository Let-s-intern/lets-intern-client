/**
 * Notion 임베드 URL 화이트리스트 유틸.
 *
 * 정확한 호스트 비교만 허용한다. 서브도메인/유사 호스트는 거부.
 *  - https://letsintern.notion.site/...
 *  - https://www.notion.so/...
 */

const ALLOWED_NOTION_HOSTS = new Set([
  'letsintern.notion.site',
  'www.notion.so',
]);

/**
 * 주어진 문자열이 화이트리스트 통과한 노션 임베드 URL 인지 검사한다.
 * - URL 파싱 실패 시 false
 * - https 가 아니면 false
 * - host 가 ALLOWED_NOTION_HOSTS 와 정확히 일치하지 않으면 false
 */
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

/**
 * 입력 텍스트에서 단일 노션 URL 을 추출 + 검증한다.
 * - 텍스트가 단일 URL 인 경우만 다룬다 (앞뒤 공백 trim).
 * - 검증 통과 시 trim 된 URL 문자열을, 실패 시 null 을 반환한다.
 */
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
