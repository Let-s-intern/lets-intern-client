/**
 * §8.2.T1 — shouldSendLog 단위 테스트.
 *
 * 시드된 random mock으로 level별 통과율을 검증한다 (10000회 표본, ±2% 허용).
 */
import { shouldSendLog } from './sentryLogSampler';

const SAMPLES = 10000;
const TOLERANCE = 0.02;

function makeSeededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    // mulberry32 — deterministic PRNG (재현성 보장)
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ratePassed(level: string, rng: () => number): number {
  let passed = 0;
  for (let i = 0; i < SAMPLES; i++) {
    if (shouldSendLog(level, rng)) passed++;
  }
  return passed / SAMPLES;
}

describe('shouldSendLog', () => {
  it('trace: 1% 통과 (±2%)', () => {
    const rate = ratePassed('trace', makeSeededRandom(42));
    expect(rate).toBeGreaterThanOrEqual(0.01 - TOLERANCE);
    expect(rate).toBeLessThanOrEqual(0.01 + TOLERANCE);
  });

  it('debug: 1% 통과 (±2%)', () => {
    const rate = ratePassed('debug', makeSeededRandom(123));
    expect(rate).toBeGreaterThanOrEqual(0.01 - TOLERANCE);
    expect(rate).toBeLessThanOrEqual(0.01 + TOLERANCE);
  });

  it('info: 5% 통과 (±2%)', () => {
    const rate = ratePassed('info', makeSeededRandom(7));
    expect(rate).toBeGreaterThanOrEqual(0.05 - TOLERANCE);
    expect(rate).toBeLessThanOrEqual(0.05 + TOLERANCE);
  });

  it('warn: 100% 통과', () => {
    const rate = ratePassed('warn', makeSeededRandom(99));
    expect(rate).toBe(1);
  });

  it('error: 100% 통과', () => {
    const rate = ratePassed('error', makeSeededRandom(101));
    expect(rate).toBe(1);
  });

  it('fatal: 100% 통과', () => {
    const rate = ratePassed('fatal', makeSeededRandom(202));
    expect(rate).toBe(1);
  });

  it('알 수 없는 level: 통과 (강건성)', () => {
    expect(shouldSendLog('unknown', () => 0.5)).toBe(true);
  });

  it('default Math.random도 호출 가능', () => {
    // 호출 자체가 throw 안 하면 OK
    expect(typeof shouldSendLog('warn')).toBe('boolean');
  });
});
