/**
 * §8.2 — Sentry Logs ingestion 비용 보호용 샘플링.
 *
 * Sentry SDK의 `beforeSendLog` 훅에서 호출. trace/debug/info를 다운샘플링하고
 * warn 이상은 100% 통과시킨다.
 *
 * 정책 (PRD §4.11):
 *   trace, debug → 1%
 *   info         → 5%
 *   warn         → 100%
 *   error        → 100%
 *   fatal        → 100%
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const TRACE_DEBUG_RATE = 0.01;
const INFO_RATE = 0.05;

export function shouldSendLog(
  level: string,
  randomFn: () => number = Math.random,
): boolean {
  switch (level) {
    case 'trace':
    case 'debug':
      return randomFn() < TRACE_DEBUG_RATE;
    case 'info':
      return randomFn() < INFO_RATE;
    case 'warn':
    case 'error':
    case 'fatal':
      return true;
    default:
      // 알 수 없는 level은 보수적으로 통과 (변화에 강건)
      return true;
  }
}
