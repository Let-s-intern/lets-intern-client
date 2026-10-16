import type { VodPass } from '@/api/vodPass';
import {
  getVodPassRefundBlockedReason,
  getVodPassRefundErrorMessage,
  hasLaterVodPass,
} from './vodPassRefund';

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

describe('getVodPassRefundBlockedReason', () => {
  it('환불할 수 있으면 문구가 없다', () => {
    expect(getVodPassRefundBlockedReason(makePass({}))).toBeNull();
  });

  it('이용 중인 이용권은 이용이 시작되어 환불할 수 없다고 알려준다', () => {
    expect(
      getVodPassRefundBlockedReason(
        makePass({ status: 'ACTIVE', refundable: false }),
      ),
    ).toBe('이용이 시작된 이용권은 환불할 수 없습니다');
  });

  it('종료된 이용권은 이용 기간이 끝나 환불할 수 없다고 알려준다', () => {
    expect(
      getVodPassRefundBlockedReason(
        makePass({ status: 'EXPIRED', refundable: false }),
      ),
    ).toBe('이용 기간이 종료된 이용권은 환불할 수 없습니다');
  });

  it('이용 예정 이용권은 환불할 수 있으므로 서버가 막았을 때만 일반 문구를 쓴다', () => {
    expect(
      getVodPassRefundBlockedReason(
        makePass({ status: 'SCHEDULED', refundable: true }),
      ),
    ).toBeNull();
    expect(
      getVodPassRefundBlockedReason(
        makePass({ status: 'SCHEDULED', refundable: false }),
      ),
    ).toBe('현재 환불할 수 없는 이용권입니다');
  });

  it('이미 취소된 이용권은 별도 배너가 있어 문구가 없다', () => {
    expect(
      getVodPassRefundBlockedReason(
        makePass({ status: 'CANCELED', refundable: false }),
      ),
    ).toBeNull();
  });

  it('미활성이지만 서버가 환불 불가라고 한 이용권은 일반 문구를 쓴다', () => {
    expect(getVodPassRefundBlockedReason(makePass({ refundable: false }))).toBe(
      '현재 환불할 수 없는 이용권입니다',
    );
  });
});

describe('getVodPassRefundErrorMessage', () => {
  it('409 는 BE 메시지를 돌려준다', () => {
    expect(
      getVodPassRefundErrorMessage({
        status: 409,
        serverMessage: 'VOD 이용권 환불 결과 확인 중입니다.',
      }),
    ).toBe('VOD 이용권 환불 결과 확인 중입니다.');
  });

  it('400 APPLICATION_CANNOT_CANCELED 도 BE 메시지를 돌려준다', () => {
    expect(
      getVodPassRefundErrorMessage({
        status: 400,
        code: 'APPLICATION_CANNOT_CANCELED',
        serverMessage: '환불이 불가능한 기간입니다.',
      }),
    ).toBe('환불이 불가능한 기간입니다.');
  });

  it('다른 400 은 BE 메시지가 있어도 null 이다', () => {
    expect(
      getVodPassRefundErrorMessage({
        status: 400,
        code: 'BAD_REQUEST',
        serverMessage: '잘못된 요청입니다.',
      }),
    ).toBeNull();
  });

  it('409 가 아니거나 메시지가 없으면 null 이다', () => {
    expect(
      getVodPassRefundErrorMessage({ status: 500, serverMessage: '오류' }),
    ).toBeNull();
    expect(getVodPassRefundErrorMessage({ status: 409 })).toBeNull();
    expect(getVodPassRefundErrorMessage(new Error('x'))).toBeNull();
    expect(getVodPassRefundErrorMessage(null)).toBeNull();
  });
});

describe('hasLaterVodPass', () => {
  const current = makePass({
    status: 'SCHEDULED',
    startsAt: '2026-11-01T00:00:00+09:00',
    endsAt: '2026-12-01T00:00:00+09:00',
  });

  it('종료일 이후에 시작하는 취소되지 않은 이용권이 있으면 참이다', () => {
    const later = makePass({
      applicationId: 12,
      status: 'SCHEDULED',
      startsAt: '2026-12-01T00:00:00+09:00',
      endsAt: '2026-12-31T00:00:00+09:00',
    });

    expect(hasLaterVodPass(current, [current, later])).toBe(true);
  });

  it('뒤 이용권이 취소됐거나 앞선 이용권뿐이면 거짓이다', () => {
    const canceledLater = makePass({
      applicationId: 12,
      status: 'CANCELED',
      startsAt: '2026-12-01T00:00:00+09:00',
      endsAt: '2026-12-31T00:00:00+09:00',
    });
    const earlier = makePass({
      applicationId: 13,
      status: 'ACTIVE',
      startsAt: '2026-10-01T00:00:00+09:00',
      endsAt: '2026-11-01T00:00:00+09:00',
    });

    expect(hasLaterVodPass(current, [current, canceledLater, earlier])).toBe(
      false,
    );
  });

  it('이 이용권의 종료일을 모르면 거짓이다', () => {
    expect(
      hasLaterVodPass(makePass({ status: 'UNACTIVATED' }), [
        makePass({
          applicationId: 12,
          startsAt: '2026-12-01T00:00:00+09:00',
        }),
      ]),
    ).toBe(false);
  });
});
