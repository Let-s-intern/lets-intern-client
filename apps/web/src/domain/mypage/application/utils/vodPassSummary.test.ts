import type { VodPass } from '@/api/vodPass';
import { findLastEndedVodPass, summarizeVodPasses } from './vodPassSummary';

const makePass = (overrides: Partial<VodPass>): VodPass => ({
  applicationId: 1,
  paymentId: 10,
  startsAt: null,
  endsAt: null,
  status: 'ACTIVE',
  paidAmount: 1000,
  refundable: false,
  durationDays: 30,
  ...overrides,
});

const NOW = new Date('2026-10-26T12:00:00+09:00');

describe('summarizeVodPasses', () => {
  it('이용 중이거나 예정인 이용권이 없으면 null 이다', () => {
    const passes = [
      makePass({
        status: 'EXPIRED',
        startsAt: '2026-08-01T00:00:00',
        endsAt: '2026-08-31T00:00:00',
      }),
      makePass({ status: 'CANCELED' }),
    ];

    expect(summarizeVodPasses(passes, NOW)).toBeNull();
  });

  it('이용 중인 이용권 하나면 그 기간과 남은 일수를 준다', () => {
    const passes = [
      makePass({
        status: 'ACTIVE',
        startsAt: '2026-10-26T11:00:00+09:00',
        endsAt: '2026-11-25T11:00:00+09:00',
      }),
    ];

    expect(summarizeVodPasses(passes, NOW)).toEqual({
      startsAt: '2026-10-26T11:00:00+09:00',
      endsAt: '2026-11-25T11:00:00+09:00',
      remainingDays: 30,
      isWatchable: true,
    });
  });

  it('이어 붙은 예정 이용권까지 합쳐 가장 늦은 종료일 기준으로 남은 일수를 센다', () => {
    const passes = [
      makePass({
        applicationId: 1,
        status: 'ACTIVE',
        startsAt: '2026-10-26T11:00:00+09:00',
        endsAt: '2026-11-25T11:00:00+09:00',
      }),
      makePass({
        applicationId: 2,
        status: 'SCHEDULED',
        startsAt: '2026-11-25T11:00:00+09:00',
        endsAt: '2026-12-25T11:00:00+09:00',
      }),
      makePass({
        applicationId: 3,
        status: 'EXPIRED',
        startsAt: '2026-01-01T00:00:00+09:00',
        endsAt: '2026-01-31T00:00:00+09:00',
      }),
    ];

    expect(summarizeVodPasses(passes, NOW)).toEqual({
      startsAt: '2026-10-26T11:00:00+09:00',
      endsAt: '2026-12-25T11:00:00+09:00',
      remainingDays: 60,
      isWatchable: true,
    });
  });

  it('예정 이용권만 있으면 아직 시청할 수 없다', () => {
    const passes = [
      makePass({
        status: 'SCHEDULED',
        startsAt: '2026-11-01T00:00:00+09:00',
        endsAt: '2026-12-01T00:00:00+09:00',
      }),
    ];

    expect(summarizeVodPasses(passes, NOW)?.isWatchable).toBe(false);
  });

  it('남은 시간이 하루보다 짧아도 1일로 올림한다', () => {
    const passes = [
      makePass({
        status: 'ACTIVE',
        startsAt: '2026-10-01T00:00:00+09:00',
        endsAt: '2026-10-26T13:00:00+09:00',
      }),
    ];

    expect(summarizeVodPasses(passes, NOW)?.remainingDays).toBe(1);
  });

  it('기간이 아직 잡히지 않은 이용권은 기간 계산에서 뺀다', () => {
    const passes = [makePass({ status: 'UNACTIVATED' })];

    expect(summarizeVodPasses(passes, NOW)).toBeNull();
  });
});

describe('findLastEndedVodPass', () => {
  it('종료된 이용권 중 가장 늦게 끝난 것을 준다', () => {
    const passes = [
      makePass({
        applicationId: 1,
        status: 'EXPIRED',
        startsAt: '2026-06-01T00:00:00',
        endsAt: '2026-07-01T00:00:00',
      }),
      makePass({
        applicationId: 2,
        status: 'EXPIRED',
        startsAt: '2026-08-01T00:00:00',
        endsAt: '2026-08-31T00:00:00',
      }),
      makePass({ applicationId: 3, status: 'CANCELED' }),
    ];

    expect(findLastEndedVodPass(passes)?.applicationId).toBe(2);
  });

  it('종료된 이용권이 없으면 undefined 다', () => {
    expect(
      findLastEndedVodPass([makePass({ status: 'CANCELED' })]),
    ).toBeUndefined();
  });
});
