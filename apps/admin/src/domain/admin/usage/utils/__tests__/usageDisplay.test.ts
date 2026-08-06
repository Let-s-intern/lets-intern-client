import { describe, expect, it } from 'vitest';

import {
  formatTargetSummary,
  formatUsageStatus,
  isRecentUnused,
  RECENT_WINDOW_DAYS,
  resolveUsageStatus,
  TARGET_SUMMARY_EMPTY,
  USAGE_STATUS_LABEL,
} from '../usageDisplay';

const TRACKED_FROM = '2026-07-01T00:00:00';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-08-06T12:00:00');
const daysBefore = (days: number) =>
  new Date(NOW.getTime() - days * DAY_MS).toISOString();

describe('resolveUsageStatus', () => {
  it('최초 이용 시각이 있으면 이용함이다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: '2026-07-30T14:22:00',
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('USED');
  });

  it('최초 이용 시각이 있으면 결제일과 집계 시작이 없어도 이용함이다', () => {
    // 이용했다는 사실 자체는 다른 값의 도움 없이도 성립한다.
    expect(
      resolveUsageStatus({
        firstAccessedAt: '2026-07-30T14:22:00',
        paidAt: null,
        trackedFrom: null,
      }),
    ).toBe('USED');
  });

  it('집계 시작보다 앞선 결제는 집계 이전이다', () => {
    // 미이용이 아니다. 소급이 불가능해 기록이 없을 뿐이다.
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-06-20T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('BEFORE_TRACKING');
  });

  it('집계 시작 이후 결제인데 기록이 없으면 미이용이다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('NOT_USED');
  });

  it('결제와 집계 시작이 같은 시각이면 미이용이다', () => {
    // 경계는 집계 대상에 넣는다. 같은 시각을 집계 이전으로 밀면 도입 첫날 결제가
    // 영원히 판정 불가 취급을 받는다.
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: TRACKED_FROM,
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('NOT_USED');
  });

  it('집계 시작 1밀리초 전 결제는 집계 이전이다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-06-30T23:59:59.999',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('BEFORE_TRACKING');
  });

  it('집계 시작을 모르면 미이용으로 떨어뜨리지 않는다', () => {
    // 여기서 미이용이라고 말하면 과거 결제 전체가 전액 환불 대상처럼 보인다.
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: null,
      }),
    ).toBe('UNKNOWN');
  });

  it('결제 시각을 모르면 확인 불가다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: null,
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('UNKNOWN');
  });

  it('필드가 아예 없어도 확인 불가로 떨어진다', () => {
    expect(resolveUsageStatus({})).toBe('UNKNOWN');
  });

  it('조회에 실패해 기록이 없으면 확인 불가다', () => {
    // 없는 것과 못 읽은 것은 다르다.
    expect(resolveUsageStatus(null)).toBe('UNKNOWN');
    expect(resolveUsageStatus(undefined)).toBe('UNKNOWN');
  });

  it('읽을 수 없는 결제 시각은 확인 불가다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '알 수 없음',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('UNKNOWN');
  });

  it('읽을 수 없는 집계 시작 시각은 확인 불가다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: 'not-a-date',
      }),
    ).toBe('UNKNOWN');
  });

  it('읽을 수 없는 최초 이용 시각은 이용함으로 단정하지 않는다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: 'broken',
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('UNKNOWN');
  });

  it('빈 문자열 최초 이용 시각은 값이 없는 것으로 본다', () => {
    expect(
      resolveUsageStatus({
        firstAccessedAt: '',
        paidAt: '2026-07-28T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('NOT_USED');
  });
});

describe('formatUsageStatus', () => {
  it('판정을 화면 문구로 바꾼다', () => {
    expect(
      formatUsageStatus({
        firstAccessedAt: null,
        paidAt: '2026-06-20T10:00:00',
        trackedFrom: TRACKED_FROM,
      }),
    ).toBe('기록 없음 (집계 이전)');

    expect(formatUsageStatus(null)).toBe('확인 불가');
  });

  it('환불 가부를 말하는 문구가 없다', () => {
    // 화면이 결론을 내리면 예외 상황에서 잘못된 근거가 된다.
    Object.values(USAGE_STATUS_LABEL).forEach((label) => {
      expect(label).not.toContain('환불');
    });
  });
});

describe('isRecentUnused', () => {
  const unused = (paidAt: string) => ({
    firstAccessedAt: null,
    paidAt,
    trackedFrom: TRACKED_FROM,
  });

  it('미이용이고 결제 후 7일 이내면 강조 대상이다', () => {
    expect(isRecentUnused(unused(daysBefore(2)), NOW)).toBe(true);
  });

  it('정확히 7일째도 이내로 본다', () => {
    expect(isRecentUnused(unused(daysBefore(RECENT_WINDOW_DAYS)), NOW)).toBe(
      true,
    );
  });

  it('7일을 1밀리초라도 넘기면 강조하지 않는다', () => {
    const paidAt = new Date(
      NOW.getTime() - RECENT_WINDOW_DAYS * DAY_MS - 1,
    ).toISOString();

    expect(isRecentUnused({ ...unused(paidAt) }, NOW)).toBe(false);
  });

  it('7일에서 1초를 넘기면 강조하지 않는다', () => {
    const paidAt = new Date(
      NOW.getTime() - RECENT_WINDOW_DAYS * DAY_MS - 1000,
    ).toISOString();

    expect(isRecentUnused(unused(paidAt), NOW)).toBe(false);
  });

  it('결제일이 기준 시각보다 미래면 강조하지 않는다', () => {
    // 경과 시간이 음수라 상한만 보면 그대로 통과한다. 시계 오차나 잘못된 데이터다.
    const paidAt = new Date(NOW.getTime() + DAY_MS).toISOString();

    expect(isRecentUnused(unused(paidAt), NOW)).toBe(false);
  });

  it('7일이 지난 미이용은 강조하지 않는다', () => {
    expect(isRecentUnused(unused(daysBefore(20)), NOW)).toBe(false);
  });

  it('이용한 건은 결제 직후라도 강조하지 않는다', () => {
    expect(
      isRecentUnused(
        {
          firstAccessedAt: daysBefore(1),
          paidAt: daysBefore(2),
          trackedFrom: TRACKED_FROM,
        },
        NOW,
      ),
    ).toBe(false);
  });

  it('집계 이전 건은 강조하지 않는다', () => {
    // 기록이 없는 이유가 미이용이 아니다. 강조하면 그 강조가 잘못된 환불 근거가 된다.
    expect(
      isRecentUnused(
        {
          firstAccessedAt: null,
          paidAt: '2026-06-20T10:00:00',
          trackedFrom: TRACKED_FROM,
        },
        new Date('2026-06-22T10:00:00'),
      ),
    ).toBe(false);
  });

  it('확인 불가 건은 강조하지 않는다', () => {
    expect(
      isRecentUnused(
        { firstAccessedAt: null, paidAt: daysBefore(1), trackedFrom: null },
        NOW,
      ),
    ).toBe(false);
    expect(isRecentUnused(null, NOW)).toBe(false);
  });

  it('기준 시각을 숫자로도 받는다', () => {
    expect(isRecentUnused(unused(daysBefore(2)), NOW.getTime())).toBe(true);
  });

  it('기간을 바꿔 물어볼 수 있다', () => {
    expect(isRecentUnused(unused(daysBefore(10)), NOW, 14)).toBe(true);
    expect(isRecentUnused(unused(daysBefore(10)), NOW, 3)).toBe(false);
  });
});

describe('formatTargetSummary', () => {
  it('대시보드와 미션을 함께 표기한다', () => {
    expect(
      formatTargetSummary([
        { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
        { targetType: 'MISSION', count: 3 },
      ]),
    ).toBe('대시보드, 미션 3건');
  });

  it('1건이면 개수를 붙이지 않는다', () => {
    // count 는 접근 횟수가 아니라 대상 개수다. `대시보드 1건` 은 한 번 들어갔다는 뜻으로 읽힌다.
    expect(
      formatTargetSummary([{ targetType: 'CHALLENGE_DASHBOARD', count: 1 }]),
    ).toBe('대시보드');
  });

  it('프로그램 단일 대상을 표기한다', () => {
    expect(formatTargetSummary([{ targetType: 'PROGRAM', count: 1 }])).toBe(
      '프로그램',
    );
  });

  it('모르는 항목도 버리지 않는다', () => {
    // 조용히 사라지면 이용한 행이 이용 항목 없음으로 읽혀 정반대 결론이 나온다.
    const formatted = formatTargetSummary([
      { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
      { targetType: 'LIVE_SESSION', count: 2 },
    ]);

    expect(formatted).toBe('대시보드, 기타(LIVE_SESSION) 2건');
  });

  it('항목 종류를 알 수 없어도 자리를 남긴다', () => {
    expect(formatTargetSummary([{ targetType: '', count: 1 }])).toBe('기타');
  });

  it('개수가 없으면 개수를 붙이지 않는다', () => {
    expect(formatTargetSummary([{ targetType: 'MISSION' }])).toBe('미션');
    expect(formatTargetSummary([{ targetType: 'MISSION', count: null }])).toBe(
      '미션',
    );
  });

  it('개수가 0 인 항목은 뺀다', () => {
    // 대상이 하나도 없다는 뜻인데 라벨만 남으면 이용한 것처럼 읽힌다.
    expect(
      formatTargetSummary([
        { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
        { targetType: 'MISSION', count: 0 },
      ]),
    ).toBe('대시보드');
  });

  it('전부 0 이면 없음으로 말한다', () => {
    expect(
      formatTargetSummary([
        { targetType: 'CHALLENGE_DASHBOARD', count: 0 },
        { targetType: 'MISSION', count: 0 },
      ]),
    ).toBe(TARGET_SUMMARY_EMPTY);
  });

  it('비어 있으면 빈 문자열이 아니라 없음으로 말한다', () => {
    expect(formatTargetSummary([])).toBe(TARGET_SUMMARY_EMPTY);
    expect(formatTargetSummary(null)).toBe(TARGET_SUMMARY_EMPTY);
    expect(formatTargetSummary(undefined)).toBe(TARGET_SUMMARY_EMPTY);
  });
});
