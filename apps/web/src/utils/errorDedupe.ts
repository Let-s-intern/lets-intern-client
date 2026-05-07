/**
 * 에러 webhook dedupe — 동일 signature(name + message 200자) 반복 발생 시
 * 카운트만 누적하고 Slack 즉시 발송은 차단. 야간 cron `/api/notify-digest` 가
 * `flushAll()` 로 일괄 digest 형태로 발송.
 *
 * 정책:
 *  - 첫 발생: send (true 리턴)
 *  - 반복:    skip (false 리턴, count++)
 *  - crash 분류 이벤트는 호출 단(route.ts)에서 dedupe 자체를 우회시킨다.
 *
 * 한계 (인지하고 사용):
 *  - 모듈 레벨 Map 이라 *단일 Node 인스턴스* 내에서만 공유. Vercel 다중 서버리스
 *    인스턴스 환경에선 인스턴스마다 별개 카운터 → "처음 본 에러" 가 인스턴스 수만큼
 *    Slack 으로 갈 수 있음. 그래도 무방비 폭주 대비 큰 폭 감소.
 *  - cron flush 도 그 시점 warm 상태인 인스턴스 1개의 store 만 비움.
 *  - 진짜 글로벌 dedupe 가 필요해지면 Vercel KV / Upstash Redis 로 이전.
 *    인터페이스(buildSignature/recordAndCheckFirst/flushAll)는 그대로 유지.
 */

export type DedupeEntry = {
  signature: string;
  name: string;
  message: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  sampleUrl?: string;
  sampleUserAgent?: string;
};

const store = new Map<string, DedupeEntry>();

export function buildSignature(name: string, message: string): string {
  return `${name}::${message.slice(0, 200)}`;
}

/**
 * @returns true 이면 첫 발생(send 권장), false 이면 반복(skip, 카운트만 증가).
 */
export function recordAndCheckFirst(
  signature: string,
  sample: {
    name: string;
    message: string;
    url?: string;
    userAgent?: string;
  },
): boolean {
  const now = new Date().toISOString();
  const existing = store.get(signature);

  if (existing) {
    existing.count += 1;
    existing.lastSeen = now;
    return false;
  }

  store.set(signature, {
    signature,
    name: sample.name,
    message: sample.message,
    count: 1,
    firstSeen: now,
    lastSeen: now,
    sampleUrl: sample.url,
    sampleUserAgent: sample.userAgent,
  });
  return true;
}

/**
 * 누적된 dedupe entries 모두 반환하고 store 비움. cron digest 에서 호출.
 */
export function flushAll(): DedupeEntry[] {
  const entries = Array.from(store.values());
  store.clear();
  return entries;
}
