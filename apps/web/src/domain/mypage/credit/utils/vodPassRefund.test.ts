import type { VodPass } from '@/api/vodPass';
import {
  getVodPassRefundBlockedReason,
  getVodPassRefundErrorMessage,
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

  it.each(['ACTIVE', 'SCHEDULED', 'EXPIRED'] as const)(
    '%s 이용권은 활성화한 이용권은 환불할 수 없다고 알려준다',
    (status) => {
      expect(
        getVodPassRefundBlockedReason(makePass({ status, refundable: false })),
      ).toBe('활성화한 이용권은 환불할 수 없습니다');
    },
  );

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

  it('409 가 아니거나 메시지가 없으면 null 이다', () => {
    expect(
      getVodPassRefundErrorMessage({ status: 500, serverMessage: '오류' }),
    ).toBeNull();
    expect(getVodPassRefundErrorMessage({ status: 409 })).toBeNull();
    expect(getVodPassRefundErrorMessage(new Error('x'))).toBeNull();
    expect(getVodPassRefundErrorMessage(null)).toBeNull();
  });
});
