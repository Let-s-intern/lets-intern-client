/**
 * Jitsi 라이브 회의실 입장 준비 — 멘토·멘티 공통 로직.
 *
 * BE 계약(LC-3065): 라이브 회의실의 방 이름(`meetingRoom`)은 예약 생성 시 BE 가
 * 랜덤으로 만들어 저장하지만, 완성된 `meetingUrl`(= base + meetingRoom)은
 * **먼저 입장하는 쪽**이 jitsi 도메인 헬스체크 후 healthy base URL 을
 * `PATCH /feedback/{id}/meeting-url` 로 보내면 BE 가 합성·저장한다.
 * → FE 는 완성 URL 이 아니라 **base URL 만** 보낸다.
 *
 * 멘토·멘티 어느 쪽이 먼저 입장하든 동일하게 동작하도록(데드락 방지) 이 로직을
 * 공유 패키지에 둔다. 단, **후보 base URL(env)·PATCH(앱별 axios)는 앱마다 다르므로**
 * 인자로 주입받는다(번들러/인증 결합 회피).
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
 * 후보 도메인들을 헬스체크해 **우선순위가 가장 높은 healthy base URL** 을 반환한다.
 * 모두 실패하면 null.
 *
 * 헬스체크는 서로 독립적이므로 `Promise.all` 로 **병렬** 수행한다(Vercel 베스트 프랙티스).
 * 순차 실행이면 앞 도메인이 죽었을 때 타임아웃만큼 기다린 뒤 다음을 시도해 최악
 * 대기가 후보 수에 비례하지만, 병렬이면 최악 대기가 단일 타임아웃으로 고정된다.
 * 결과 배열은 입력 순서를 보존하므로 가장 먼저 성공한(우선순위 높은) 도메인을 고른다.
 *
 * @param candidates 우선순위 순 base URL 목록 (빈 값은 무시)
 */
export async function resolveHealthyJitsiBaseUrl(
  candidates: ReadonlyArray<string | undefined>,
): Promise<string | null> {
  const urls = candidates.filter((u): u is string => !!u && u.trim() !== '');
  const results = await Promise.all(
    urls.map(async (url) => ({ url, healthy: await isDomainHealthy(url) })),
  );
  const firstHealthy = results.find((r) => r.healthy);
  return firstHealthy ? normalizeBase(firstHealthy.url) : null;
}

export interface EnsureLiveMeetingUrlOptions {
  /** 현재 BE 가 내려준 meetingUrl. 이미 있으면 헬스체크/등록 없이 그대로 입장. */
  meetingUrl: string | null | undefined;
  /** 우선순위 순 jitsi base URL 후보 (앱별 env 에서 주입). */
  baseCandidates: ReadonlyArray<string | undefined>;
  /**
   * healthy base URL 을 BE 에 등록하는 콜백 (앱별 `PATCH /feedback/{id}/meeting-url`).
   * BE 가 base + meetingRoom 으로 meetingUrl 을 합성·저장한다.
   */
  registerBaseUrl: (baseUrl: string) => Promise<void>;
}

export type EnsureLiveMeetingUrlResult =
  | { ok: true }
  | { ok: false; reason: 'no-healthy-domain' };

/**
 * 라이브 회의실 입장 준비 — 멘토·멘티 공통.
 *
 * - `meetingUrl` 이 이미 있으면(누군가 먼저 입장해 등록함) 그대로 입장 가능(`ok`).
 * - 없으면(내가 먼저 입장) 후보 도메인 헬스체크 → healthy base 를 `registerBaseUrl` 로
 *   BE 에 보내 meetingUrl 을 생성한다. 등록 후 호출 측에서 쿼리 invalidate → refetch 로
 *   완성된 meetingUrl 이 채워진다.
 * - 살아있는 도메인이 하나도 없으면 `{ ok: false }`.
 */
export async function ensureLiveMeetingUrl(
  options: EnsureLiveMeetingUrlOptions,
): Promise<EnsureLiveMeetingUrlResult> {
  if (options.meetingUrl) return { ok: true };

  const healthyBase = await resolveHealthyJitsiBaseUrl(options.baseCandidates);
  if (!healthyBase) return { ok: false, reason: 'no-healthy-domain' };

  await options.registerBaseUrl(healthyBase);
  return { ok: true };
}
