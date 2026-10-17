import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';
import {
  formatVodPassPeriod,
  formatVodPassRemaining,
  summarizeVodPassHolding,
} from './vodPassHolding';

const NOW = dayjs('2026-11-01T12:00:00+09:00');

const makePass = (overrides: Partial<VodPass>): VodPass => ({
  applicationId: 1,
  paymentId: 10,
  startsAt: '2026-10-16T10:00:00+09:00',
  endsAt: '2027-01-14T10:00:00+09:00',
  status: 'ACTIVE',
  paidAmount: 40000,
  refundable: false,
  durationDays: 90,
  purchasedMonths: 3,
  ...overrides,
});

describe('summarizeVodPassHolding', () => {
  it('이용 중인 이용권이 없으면 null 이다', () => {
    expect(summarizeVodPassHolding([], NOW)).toBeNull();
    expect(
      summarizeVodPassHolding([makePass({ status: 'EXPIRED' })], NOW),
    ).toBeNull();
    expect(
      summarizeVodPassHolding(
        [
          makePass({
            status: 'SCHEDULED',
            startsAt: '2026-12-01T00:00:00+09:00',
          }),
        ],
        NOW,
      ),
    ).toBeNull();
    expect(
      summarizeVodPassHolding([makePass({ status: 'CANCELED' })], NOW),
    ).toBeNull();
  });

  it('이미 종료 시각이 지난 ACTIVE 는 보유 중으로 보지 않는다 (목록이 오래된 경우)', () => {
    expect(
      summarizeVodPassHolding(
        [makePass({ endsAt: '2026-10-31T00:00:00+09:00' })],
        NOW,
      ),
    ).toBeNull();
  });

  it('이용 중인 이용권 하나면 그 종료일이 끝이다', () => {
    const holding = summarizeVodPassHolding([makePass({})], NOW);

    expect(holding?.endsAt).toBe('2027-01-14T10:00:00+09:00');
    expect(holding?.hasScheduled).toBe(false);
  });

  it('이어서 시작하는 예약 이용권이 있으면 마지막 종료일까지 합친다', () => {
    const scheduled = makePass({
      applicationId: 2,
      status: 'SCHEDULED',
      startsAt: '2027-01-14T10:00:00+09:00',
      endsAt: '2027-02-13T10:00:00+09:00',
    });
    const scheduledLater = makePass({
      applicationId: 3,
      status: 'SCHEDULED',
      startsAt: '2027-02-13T10:00:00+09:00',
      endsAt: '2027-03-15T10:00:00+09:00',
    });

    const holding = summarizeVodPassHolding(
      [scheduledLater, makePass({}), scheduled],
      NOW,
    );

    expect(holding?.endsAt).toBe('2027-03-15T10:00:00+09:00');
    expect(holding?.hasScheduled).toBe(true);
  });

  it('앞선 이용권과 떨어져 시작하는 예약 이용권은 합치지 않는다', () => {
    const gap = makePass({
      applicationId: 2,
      status: 'SCHEDULED',
      startsAt: '2027-03-01T00:00:00+09:00',
      endsAt: '2027-03-31T00:00:00+09:00',
    });

    const holding = summarizeVodPassHolding([makePass({}), gap], NOW);

    expect(holding?.endsAt).toBe('2027-01-14T10:00:00+09:00');
    expect(holding?.hasScheduled).toBe(false);
  });
});

describe('formatVodPassRemaining', () => {
  it('개월과 일을 달력 기준으로 센다', () => {
    expect(formatVodPassRemaining('2027-01-14T10:00:00+09:00', NOW)).toBe(
      '2개월 13일 남음',
    );
  });

  it('1개월 미만이면 일만, 정확히 개월이면 개월만 보인다', () => {
    expect(formatVodPassRemaining('2026-11-13T12:00:00+09:00', NOW)).toBe(
      '12일 남음',
    );
    expect(formatVodPassRemaining('2027-02-01T12:00:00+09:00', NOW)).toBe(
      '3개월 남음',
    );
  });

  it('오늘 안에 끝나면 오늘 종료다', () => {
    expect(formatVodPassRemaining('2026-11-01T20:00:00+09:00', NOW)).toBe(
      '오늘 종료',
    );
  });
});

describe('formatVodPassPeriod', () => {
  it('시작일과 종료일을 점 표기로 이어 붙인다', () => {
    expect(
      formatVodPassPeriod(
        '2026-10-16T10:00:00+09:00',
        '2027-01-14T10:00:00+09:00',
      ),
    ).toBe('2026.10.16 ~ 2027.01.14');
  });
});
