/**
 * Notion 임베드 URL 화이트리스트 유틸.
 *
 * 노션의 공개(publish) 페이지는 워크스페이스마다 서로 다른 서브도메인을 사용한다.
 *   - https://letsintern.notion.site/...
 *   - https://boggy-chestnut-60b.notion.site/...
 *   - https://<workspace>.notion.site/...
 *
 * 따라서 `*.notion.site` 서브도메인 패턴을 허용한다.
 * `www.notion.so` 는 노션 측에서 `X-Frame-Options` 로 iframe 임베드를 차단하므로 제거.
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

/**
 * 주어진 문자열이 화이트리스트 통과한 노션 임베드 URL 인지 검사한다.
 * - URL 파싱 실패 시 false
 * - https 가 아니면 false
 * - host 가 `*.notion.site` 패턴이 아니면 false
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

  return isNotionPublishHost(parsed.host);
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

const NOTION_PAGE_ID_RE =
  /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/**
 * 노션 publish URL 을 iframe 임베드용 URL(`/ebd/<page-id>`) 로 변환한다.
 *
 * 노션은 일반 publish 페이지에는 `X-Frame-Options` 로 iframe 임베드를 차단하지만,
 * `/ebd/<page-id>` 경로에 대해서는 임베드를 허용하는 별도 응답을 내려준다.
 * 따라서 사용자가 복사한 publish URL 을 그대로 iframe `src` 에 박으면 화면이 비고,
 * 이 함수로 변환된 URL 을 써야 정상 렌더된다.
 *
 * 변환 규칙:
 *  - 화이트리스트 미통과 URL → null
 *  - pathname 이 이미 `/ebd/...` 로 시작하면 그대로 반환(쿼리스트링은 제거).
 *  - pathname 의 마지막 부분에서 32자 hex 또는 dashed UUID 형식의 page-id 를 추출,
 *    `https://<host>/ebd/<id-hex32>` 로 정규화하여 반환.
 *  - page-id 를 찾지 못하면 null.
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
