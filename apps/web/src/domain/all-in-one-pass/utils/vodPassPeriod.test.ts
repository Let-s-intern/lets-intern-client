import type { VodPass } from '@/api/vodPass';
import { getVodPassDDayLabel, getVodPassPeriod } from './vodPassPeriod';

const pass = (
  status: VodPass['status'],
  startsAt: string | null,
  endsAt: string | null,
): VodPass => ({
  applicationId: 1,
  status,
  startsAt,
  endsAt,
  refundable: false,
});

describe('getVodPassPeriod', () => {
  it('이용 중인 이용권의 시작일과 마감일을 돌려준다', () => {
    expect(
      getVodPassPeriod([
        pass(
          'ACTIVE',
          '2026-10-01T10:00:00+09:00',
          '2026-11-01T10:00:00+09:00',
        ),
      ]),
    ).toEqual({
      startsAt: '2026-10-01T10:00:00+09:00',
      endsAt: '2026-11-01T10:00:00+09:00',
      isActive: true,
    });
  });

  it('응답 순서와 무관하게 이어지는 구매분을 합친다', () => {
    expect(
      getVodPassPeriod([
        pass(
          'SCHEDULED',
          '2026-11-01T10:00:00+09:00',
          '2026-12-01T10:00:00+09:00',
        ),
        pass(
          'ACTIVE',
          '2026-10-01T10:00:00+09:00',
          '2026-11-01T10:00:00+09:00',
        ),
      ]),
    ).toMatchObject({
      startsAt: '2026-10-01T10:00:00+09:00',
      endsAt: '2026-12-01T10:00:00+09:00',
    });
  });

  it('기간이 끊어진 뒤의 구매분은 합치지 않는다', () => {
    expect(
      getVodPassPeriod([
        pass(
          'ACTIVE',
          '2026-10-01T10:00:00+09:00',
          '2026-11-01T10:00:00+09:00',
        ),
        pass(
          'SCHEDULED',
          '2026-11-02T10:00:00+09:00',
          '2026-12-02T10:00:00+09:00',
        ),
      ])?.endsAt,
    ).toBe('2026-11-01T10:00:00+09:00');
  });

  it('이용 시작 전 이용권만 있으면 isActive 가 false 다', () => {
    expect(
      getVodPassPeriod([
        pass(
          'SCHEDULED',
          '2026-11-01T10:00:00+09:00',
          '2026-12-01T10:00:00+09:00',
        ),
      ])?.isActive,
    ).toBe(false);
  });

  it.each(['EXPIRED', 'CANCELED', 'UNACTIVATED'] as const)(
    '%s 이용권만 있으면 null 이다',
    (status) => {
      expect(
        getVodPassPeriod([
          pass(
            status,
            '2026-10-01T10:00:00+09:00',
            '2026-11-01T10:00:00+09:00',
          ),
        ]),
      ).toBeNull();
    },
  );

  it('이용권이 없으면 null 이다', () => {
    expect(getVodPassPeriod([])).toBeNull();
  });
});

describe('getVodPassDDayLabel', () => {
  it('시각이 아니라 한국 날짜 차이로 센다', () => {
    expect(
      getVodPassDDayLabel(
        '2026-11-03T00:30:00+09:00',
        new Date('2026-11-02T23:30:00+09:00'),
      ),
    ).toBe('D-1');
  });

  it('마감 당일은 D-Day 다', () => {
    expect(
      getVodPassDDayLabel(
        '2026-11-02T23:00:00+09:00',
        new Date('2026-11-02T01:00:00+09:00'),
      ),
    ).toBe('D-Day');
  });
});
