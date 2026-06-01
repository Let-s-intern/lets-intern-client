/**
 * Jitsi 도메인 헬스체크.
 *
 * BE 계약(LC-3065): 멘토가 라이브 피드백에 입장할 때 FE 가 jitsi 도메인 헬스체크 후
 * **healthy base URL** 을 `PATCH /feedback/{id}/meeting-url` 로 보내면,
 * BE 가 `base + meetingRoom(랜덤)` 으로 meetingUrl 을 합성·저장한다.
 * → FE 는 완성 URL 이 아니라 **base URL 만** 보낸다.
 *
 * 후보 도메인은 env 로 주입:
 * - `VITE_JITSI_BASE_URL`     (메인)
 * - `VITE_JITSI_FALLBACK_URL` (예비)
 */

/** 헬스체크 1건 타임아웃 (ms) */
const HEALTH_CHECK_TIMEOUT_MS = 3000;

/** 끝에 슬래시가 없으면 붙인다 (BE 가 base + meetingRoom 단순 연결하므로 구분자 보장). */
function normalizeBase(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * 단일 도메인이 응답하는지 확인한다.
 *
 * jitsi 셀프호스팅은 CORS 프리플라이트를 막을 수 있어 `mode: 'no-cors'` 로 보낸다.
 * no-cors 응답은 opaque 라 status 를 읽을 수 없으므로, **fetch 가 reject 되지 않으면
 * (= 네트워크상 도달) healthy** 로 간주한다. 타임아웃·네트워크 오류면 unhealthy.
 */
async function isDomainHealthy(baseUrl: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
  try {
    await fetch(normalizeBase(baseUrl), {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 후보 도메인들을 순서대로 헬스체크해 **처음으로 healthy 한 base URL** 을 반환한다.
 * 모두 실패하면 null.
 *
 * @param candidates 우선순위 순 base URL 목록 (빈 값은 무시)
 */
export async function resolveHealthyJitsiBaseUrl(
  candidates: ReadonlyArray<string | undefined>,
): Promise<string | null> {
  const urls = candidates.filter((u): u is string => !!u && u.trim() !== '');
  for (const url of urls) {
    if (await isDomainHealthy(url)) {
      return normalizeBase(url);
    }
  }
  return null;
}
