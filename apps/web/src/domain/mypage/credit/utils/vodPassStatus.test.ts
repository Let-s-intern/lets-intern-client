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
  it('미활성 이용권은 활성화 안내와 이용 일수를 알려준다', () => {
    const rows = getVodPassInfoRows(makePass({ status: 'UNACTIVATED' }));

    expect(rows).toEqual([
      {
        label: '이용권 상태',
        value:
          '아직 활성화하지 않았습니다. VOD 사이트에서 활성화하면 30일 동안 시청할 수 있습니다',
      },
    ]);
  });

  it('이용 일수를 모르면 일수 없이 안내한다', () => {
    const rows = getVodPassInfoRows(
      makePass({ status: 'UNACTIVATED', durationDays: null }),
    );

    expect(rows[0].value).toBe(
      '아직 활성화하지 않았습니다. VOD 사이트에서 활성화하면 시청할 수 있습니다',
    );
  });

  it('이용 중인 이용권은 종료일을 알려준다', () => {
    const rows = getVodPassInfoRows(
      makePass({
        status: 'ACTIVE',
        startsAt: '2026-10-12T12:00:00+09:00',
        endsAt: '2026-11-11T12:00:00+09:00',
      }),
    );

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 중' },
      { label: '이용 종료일', value: '2026.11.11' },
    ]);
  });

  it('이용 예정인 이용권은 시작일을 알려준다', () => {
    const rows = getVodPassInfoRows(
      makePass({
        status: 'SCHEDULED',
        startsAt: '2026-12-01T12:00:00+09:00',
      }),
    );

    expect(rows).toEqual([
      { label: '이용권 상태', value: '이용 시작 예정' },
      { label: '이용 시작일', value: '2026.12.01' },
    ]);
  });

  it('종료·취소된 이용권은 해당 문구만 보인다', () => {
    expect(getVodPassInfoRows(makePass({ status: 'EXPIRED' }))).toEqual([
      { label: '이용권 상태', value: '이용 기간이 종료되었습니다' },
    ]);
    expect(getVodPassInfoRows(makePass({ status: 'CANCELED' }))).toEqual([
      { label: '이용권 상태', value: '취소된 이용권입니다' },
    ]);
  });

  it('모르는 상태는 아무것도 그리지 않는다', () => {
    expect(getVodPassInfoRows(makePass({ status: 'UNKNOWN' }))).toEqual([]);
  });
});
