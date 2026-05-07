/**
 * 에러 webhook dedupe — 동일 signature(name + message ERROR_SIGNATURE_MAX_LENGTH자)
 * 반복 발생 시 카운트만 누적하고 Slack 즉시 발송은 차단. 야간 cron
 * `/api/notify-digest` 가 `flushAll()` 로 일괄 digest 형태 Slack 발송.
 *
 * 정책:
 *  - 첫 발생: send (true 리턴)
 *  - 반복:    skip (false 리턴, count++)
 *  - crash 분류 이벤트는 호출 단(route.ts)에서 dedupe 자체를 우회시킨다.
 *
 * 한계 (운영 시 인지 필요):
 *  1) **모듈 레벨 Map** — 단일 Node 인스턴스 내에서만 공유.
 *  2) **Next.js App Router 의 route handler 별 함수 격리** — Vercel 에서
 *     `/api/send-error-webhook` (POST) 와 `/api/notify-digest` (GET) 이
 *     서로 다른 서버리스 함수로 배포되면 module store 가 *공유되지 않는다*.
 *     이 경우 GET 측 store 는 항상 비어있어 digest 가 발송되지 않을 수 있음.
 *     → 운영에서 정상 동작 검증 필요. 검증 결과 분리되어 있으면 외부 store 필수.
 *  3) **다중 인스턴스 cold start** — 같은 함수여도 인스턴스 수만큼 별개 store.
 *
 *  **글로벌 dedupe 가 필요해지면 Upstash Redis 또는 Vercel KV 로 이전한다.**
 *  인터페이스(buildSignature/recordAndCheckFirst/peekAll/clearAll/flushAll)는
 *  그대로 유지하므로 callsite 변경 최소화 가능.
 */

export const ERROR_SIGNATURE_MAX_LENGTH = 200;

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
  return `${name}::${message.slice(0, ERROR_SIGNATURE_MAX_LENGTH)}`;
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
 * Non-destructive read. cron digest 가 webhook 발송 *성공 후* `clearAll()` 호출.
 * 발송 실패 시 store 보존되어 다음 cron 또는 수동 retry 가능.
 */
export function peekAll(): DedupeEntry[] {
  return Array.from(store.values());
}

/**
 * Store 비움. 발송 성공 후에만 호출.
 */
export function clearAll(): void {
  store.clear();
}

/**
 * peek + clear 묶음. 호출 후 entries 손실 가능성이 있으므로 webhook 발송이
 * 보장된 흐름에서만 사용 권장. 신규 코드는 peekAll/clearAll 분리 사용 선호.
 */
export function flushAll(): DedupeEntry[] {
  const entries = peekAll();
  clearAll();
  return entries;
}
