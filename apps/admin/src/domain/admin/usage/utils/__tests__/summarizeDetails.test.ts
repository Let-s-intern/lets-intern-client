import type { AccessLogDetail } from '@/api/accessLog';
import { describe, expect, it } from 'vitest';

import { summarizeDetailTargets } from '../summarizeDetails';
import { formatTargetSummary, TARGET_SUMMARY_EMPTY } from '../usageDisplay';

/**
 * 단건 응답에는 목록과 달리 `targetSummary` 가 없다. 환불 모달은 `details` 에서 그것을
 * 만들어야 하는데, 여기서 세는 단위가 틀리면 화면이 곧바로 거짓말을 한다.
 *
 * `count` 는 접근 횟수가 아니라 구별되는 대상 개수다. 대시보드를 열두 번 새로고침한 건이
 * `대시보드 12건` 으로 보이면 운영은 자료를 열두 개 열어본 것으로 읽는다.
 */

const detail = (over: Partial<AccessLogDetail> = {}): AccessLogDetail => ({
  targetType: 'MISSION',
  targetId: 9001,
  targetTitle: '이력서 초안',
  missionTh: 3,
  firstAccessedAt: '2026-07-31T20:05:00',
  lastAccessedAt: '2026-07-31T20:07:00',
  accessCount: 2,
  ...over,
});

describe('summarizeDetailTargets', () => {
  it('같은 대상을 여러 번 이용해도 1건이다', () => {
    // 상세 응답은 대상별로 접혀 오지만, 어긋난 데이터로 같은 대상이 두 줄 와도 1건이어야 한다.
    const summary = summarizeDetailTargets([
      detail({ targetId: 9001, accessCount: 8 }),
      detail({ targetId: 9001, accessCount: 4 }),
    ]);

    expect(summary).toEqual([{ targetType: 'MISSION', count: 1 }]);
  });

  it('서로 다른 대상은 개수로 센다', () => {
    const summary = summarizeDetailTargets([
      detail({ targetId: 9001 }),
      detail({ targetId: 9002 }),
      detail({ targetId: 9003 }),
    ]);

    expect(summary).toEqual([{ targetType: 'MISSION', count: 3 }]);
  });

  it('접근 횟수가 아니라 대상 개수를 센다', () => {
    // 12회 이용한 대시보드 하나는 `대시보드` 1건이다.
    const summary = summarizeDetailTargets([
      detail({
        targetType: 'CHALLENGE_DASHBOARD',
        targetId: 1,
        accessCount: 12,
      }),
    ]);

    expect(summary).toEqual([{ targetType: 'CHALLENGE_DASHBOARD', count: 1 }]);
  });

  it('타입별로 나눠 세고 처음 등장한 순서를 유지한다', () => {
    const summary = summarizeDetailTargets([
      detail({ targetType: 'CHALLENGE_DASHBOARD', targetId: 1 }),
      detail({ targetType: 'MISSION', targetId: 9001 }),
      detail({ targetType: 'MISSION', targetId: 9002 }),
      detail({ targetType: 'MISSION', targetId: 9003 }),
    ]);

    expect(summary).toEqual([
      { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
      { targetType: 'MISSION', count: 3 },
    ]);
  });

  it('대상 식별자가 없는 줄은 각각 한 건으로 센다', () => {
    // 같다고 볼 근거가 없다. 하나로 접으면 실제보다 적게 이용한 것처럼 보인다.
    const summary = summarizeDetailTargets([
      detail({ targetId: null }),
      detail({ targetId: undefined }),
    ]);

    expect(summary).toEqual([{ targetType: 'MISSION', count: 2 }]);
  });

  it('모르는 타입도 버리지 않는다', () => {
    // 조용히 사라지면 실제로 이용한 건이 `없음` 으로 읽혀 정반대의 결론이 나온다.
    const summary = summarizeDetailTargets([
      detail({ targetType: 'SOMETHING_NEW', targetId: 1 }),
      detail({ targetType: null, targetId: 2 }),
    ]);

    expect(summary).toEqual([
      { targetType: 'SOMETHING_NEW', count: 1 },
      { targetType: '', count: 1 },
    ]);
  });

  it('내역이 없으면 빈 배열이다', () => {
    expect(summarizeDetailTargets([])).toEqual([]);
    expect(summarizeDetailTargets(null)).toEqual([]);
    expect(summarizeDetailTargets(undefined)).toEqual([]);
  });
});

describe('summarizeDetailTargets + formatTargetSummary', () => {
  it('목록 컬럼과 같은 문구를 만든다', () => {
    // 같은 신청서가 목록과 환불 모달에서 다르게 보이면 어느 쪽을 믿을지 알 수 없다.
    const summary = summarizeDetailTargets([
      detail({
        targetType: 'CHALLENGE_DASHBOARD',
        targetId: 1,
        accessCount: 8,
      }),
      detail({ targetId: 9001 }),
      detail({ targetId: 9002 }),
      detail({ targetId: 9003 }),
    ]);

    expect(formatTargetSummary(summary)).toBe('대시보드, 미션 3건');
  });

  it('내역이 없으면 빈칸이 아니라 없음으로 읽힌다', () => {
    expect(formatTargetSummary(summarizeDetailTargets([]))).toBe(
      TARGET_SUMMARY_EMPTY,
    );
  });
});
