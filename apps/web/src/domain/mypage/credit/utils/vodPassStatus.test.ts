import type { VodPass } from '@/api/vodPass';
import { getVodPassInfoRows } from './vodPassStatus';

const makePass = (overrides: Partial<VodPass>): VodPass => ({
  applicationId: 11,
  paymentId: 502,
  startsAt: null,
  endsAt: null,
  status: 'UNACTIVATED',
  paidAmount: 29000,
  refundable: true,
  durationDays: 30,
  ...overrides,
});

describe('getVodPassInfoRows', () => {
  it('이용 시작 전 이용권은 활성화 안내 없이 시작 전이라고만 알린다', () => {
    const rows = getVodPassInfoRows(makePass({ status: 'UNACTIVATED' }));

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 시작 전' },
      { label: '구매 기간', value: '30일' },
    ]);
    expect(JSON.stringify(rows)).not.toContain('활성화');
  });

  it('이용 중인 이용권은 이용 기간과 구매 개월 수를 알려준다', () => {
    const rows = getVodPassInfoRows(
      makePass({
        status: 'ACTIVE',
        startsAt: '2026-10-16T10:00:00+09:00',
        endsAt: '2027-01-14T10:00:00+09:00',
        durationDays: 90,
        purchasedMonths: 3,
      }),
    );

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 중' },
      { label: '이용 기간', value: '2026.10.16 ~ 2027.01.14' },
      { label: '구매 기간', value: '3개월 (90일)' },
    ]);
  });

  it('이용 예정인 이용권은 시작 예정과 이용 기간을 알려준다', () => {
    const rows = getVodPassInfoRows(
      makePass({
        status: 'SCHEDULED',
        startsAt: '2026-12-01T12:00:00+09:00',
        endsAt: '2026-12-31T12:00:00+09:00',
      }),
    );

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 시작 예정' },
      { label: '이용 기간', value: '2026.12.01 ~ 2026.12.31' },
      { label: '구매 기간', value: '30일' },
    ]);
  });

  it('종료된 이용권은 이용 기간을 남겨 보여준다', () => {
    const rows = getVodPassInfoRows(
      makePass({
        status: 'EXPIRED',
        startsAt: '2026-08-01T12:00:00+09:00',
        endsAt: '2026-08-31T12:00:00+09:00',
        durationDays: null,
      }),
    );

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 기간이 종료되었습니다' },
      { label: '이용 기간', value: '2026.08.01 ~ 2026.08.31' },
    ]);
  });

  it('기간을 모르는 경우 해당 줄만 빠진다', () => {
    const rows = getVodPassInfoRows(
      makePass({ status: 'ACTIVE', durationDays: null }),
    );

    expect(rows).toEqual([{ label: '이용권 상태', value: '이용 중' }]);
  });

  it('취소된 이용권은 해당 문구만 보인다', () => {
    expect(getVodPassInfoRows(makePass({ status: 'CANCELED' }))).toEqual([
      { label: '이용권 상태', value: '취소된 이용권입니다' },
    ]);
  });

  it('모르는 상태는 아무것도 그리지 않는다', () => {
    expect(getVodPassInfoRows(makePass({ status: 'UNKNOWN' }))).toEqual([]);
  });
});
