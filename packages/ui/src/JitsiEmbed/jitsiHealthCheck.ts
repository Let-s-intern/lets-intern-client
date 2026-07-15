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
 * base 도메인의 `health.json` 을 읽어 **실제 상태**를 판정한다.
 *
 * jitsi-web 컨테이너 nginx 가 서빙하고 watchdog 이 5초 간격으로 갱신하는
 * `GET {base}/health.json` 을 실측한다. 기존 no-cors HEAD 는 opaque 응답이라
 * 503 도 healthy 로 통과시켰지만, 여기서는 **응답 본문의 `status` 를 직접 읽어**
 * 결정적으로 구분한다. fetch·타임아웃·JSON 오류는 모두 unhealthy 로 처리한다.
 *
 * 전제: 해당 라우트에 CORS(`Access-Control-Allow-Origin`) 가 열려 있어야 한다.
 * 미개방 시 브라우저가 CORS 로 fetch 를 막아 reject → false(unhealthy) → fallback 으로
 * 귀결된다. 즉 CORS 가 열리기 전엔 base 가 항상 무시되므로 배포 전 확인이 필요하다.
 *
 * 캐시 우회: 요청마다 `?t=<now>` + `cache: 'no-store'`.
 */
async function isBaseHealthy(baseUrl: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${normalizeBase(baseUrl)}health.json?t=${Date.now()}`,
      { cache: 'no-store', signal: controller.signal },
    );
    if (!res.ok) return false;
    const body = (await res.json()) as { status?: string } | null;
    return body?.status === 'HEALTHY';
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 사용할 jitsi base URL 을 고른다 — **base 만 헬스체크**, 실패하면 즉시 fallback.
 *
 * `candidates[0]` = 우선(base), 이후 = fallback(우선순위 순). base 의 `health.json` 을
 * 확인해 healthy 면 base 를, 아니면 **fallback 은 확인하지 않고 그대로** 반환한다.
 * fallback 까지 죽은 경우는 마운트 직전 `probeJitsiExternalApi`(useJitsiConnection)
 * 가 external_api.js 로드로 최종 검증해 다음 후보로 failover 한다.
 *
 * @param candidates 우선순위 순 base URL 목록 (빈 값은 무시). 첫 값이 base.
 * @returns 사용할 base URL. base 가 죽었고 fallback 도 없으면(=쓸 곳 없음) null.
 */
export async function resolveHealthyJitsiBaseUrl(
  candidates: ReadonlyArray<string | undefined>,
): Promise<string | null> {
  const urls = candidates.filter((u): u is string => !!u && u.trim() !== '');
  if (urls.length === 0) return null;

  const [base, ...fallbacks] = urls;
  if (await isBaseHealthy(base)) return normalizeBase(base);

  const fallback = fallbacks[0];
  return fallback ? normalizeBase(fallback) : null;
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

/** URL 에서 host 를 안전하게 뽑는다. 파싱 실패면 null. */
export function safeHost(url: string): string | null {
  try {
    return new URL(url).host || null;
  } catch {
    return null;
  }
}

/**
 * 후보 base 목록에서 **아직 시도하지 않은(triedHosts 에 없는)** 첫 우선순위 base 를 고른다.
 * 없으면 null. (failover: 실패한 도메인을 제외하고 다음 서버로 넘어갈 때 사용)
 */
export function pickNextBase(
  candidates: ReadonlyArray<string | undefined>,
  triedHosts: ReadonlySet<string>,
): string | null {
  for (const candidate of candidates) {
    if (!candidate || candidate.trim() === '') continue;
    const base = normalizeBase(candidate);
    const host = safeHost(base);
    if (!host || triedHosts.has(host)) continue;
    return base;
  }
  return null;
}

/** external_api.js 프로브 타임아웃 (ms) — 스크립트 로드+파싱 여유. */
const EXTERNAL_API_PROBE_TIMEOUT_MS = 8000;

/**
 * 대상 도메인에서 Jitsi `external_api.js` 를 실제로 로드해 본다.
 *
 * base 의 `health.json` 헬스체크(isBaseHealthy)는 watchdog 기준 컨테이너 상태만
 * 알려주고 fallback 은 확인조차 하지 않지만, 이 프로브는 SDK 가 겪는 것과 **동일한
 * `<script>` 로드**를 실제 브라우저에서 수행하므로 죽은 도메인·오타 URL·fallback 장애를
 * 마운트 직전 결정적으로 감지한다(최종 게이트). `onload` 라도 `window.JitsiMeetExternalAPI` 가
 * 실제로 정의됐는지까지 확인해, 200 이지만 Jitsi 가 아닌 응답도 실패로 처리한다.
 *
 * 성공 시 주입한 `<script>` 를 남겨 SDK(`fetchExternalApi`)가 재사용하게 하고(중복
 * 주입 방지), 실패 시 죽은 태그를 제거한다(싱글톤 오염 방지).
 *
 * @param roomOrBaseUrl 회의실 URL 또는 base URL — host 만 사용한다.
 */
export function probeJitsiExternalApi(
  roomOrBaseUrl: string,
  timeoutMs: number = EXTERNAL_API_PROBE_TIMEOUT_MS,
): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);
  const host = safeHost(roomOrBaseUrl);
  if (!host) return Promise.resolve(false);

  const w = window as typeof window & { JitsiMeetExternalAPI?: unknown };
  // 이미 로드됨 — SDK 와 동일하게 재사용 가능(External API 는 도메인 무관 클래스).
  if (w.JitsiMeetExternalAPI) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://${host}/external_api.js`;

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (!ok) script.remove();
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);
    // onload 라도 스크립트가 실제로 API 를 정의했을 때만 성공으로 본다.
    script.onload = () => finish(!!w.JitsiMeetExternalAPI);
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });
}
