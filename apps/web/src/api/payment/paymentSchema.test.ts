import { paymentDetailType, paymentListType } from './paymentSchema';

const tossInfo = {
  paymentKey: 'pk_test_1',
  orderId: 'lets123',
  totalAmount: 130000,
  balanceAmount: 130000,
};

const challengeRow = {
  programInfo: {
    paymentId: 1,
    applicationId: 10,
    programType: 'CHALLENGE',
    title: '챌린지',
    price: 100000,
    paidAmount: 100000,
    paybackPrice: 0,
    optionPrice: 0,
    isCanceled: false,
    isRefunded: false,
    createDate: '2026-10-12T10:00:00',
  },
  tossInfo,
};

const vodPassRow = {
  programInfo: {
    paymentId: 2,
    applicationId: 20,
    programType: 'VOD_PASS',
    title: 'VOD 전체 이용권',
    price: 30000,
    paidAmount: 30000,
    paybackPrice: 0,
    optionPrice: 0,
    isCanceled: false,
    isRefunded: false,
    createDate: '2026-10-12T10:00:00',
  },
  tossInfo,
};

const paymentItems = [
  {
    paymentId: 1,
    applicationId: 10,
    programType: 'CHALLENGE',
    title: '챌린지',
    paidAmount: 100000,
    isCanceled: false,
    isRefunded: false,
  },
  {
    paymentId: 2,
    applicationId: 20,
    programType: 'VOD_PASS',
    title: 'VOD 전체 이용권',
    paidAmount: 30000,
    isCanceled: false,
    isRefunded: false,
  },
];

describe('paymentListType — VOD_PASS 호환', () => {
  it('VOD_PASS 행과 paymentItems 가 든 목록을 파싱한다', () => {
    const result = paymentListType.parse({
      payments: [
        {
          ...challengeRow,
          paymentItems,
          orderTotalPaidAmount: 130000,
          orderBalanceAmount: 130000,
        },
        {
          ...vodPassRow,
          paymentItems,
          orderTotalPaidAmount: 130000,
          orderBalanceAmount: 130000,
        },
      ],
    });

    expect(result.payments[1].programInfo.programType).toBe('VOD_PASS');
    expect(result.payments[1].programInfo.paidAmount).toBe(30000);
    expect(result.payments[1].paymentItems).toHaveLength(2);
    expect(result.payments[1].paymentItems?.[1].programType).toBe('VOD_PASS');
    expect(result.payments[1].orderTotalPaidAmount).toBe(130000);
    expect(result.payments[1].orderBalanceAmount).toBe(130000);
  });

  it('새 필드가 없는 기존 응답도 그대로 파싱한다', () => {
    const result = paymentListType.parse({ payments: [challengeRow] });

    expect(result.payments[0].programInfo.programType).toBe('CHALLENGE');
    expect(result.payments[0].paymentItems).toBeUndefined();
    expect(result.payments[0].orderTotalPaidAmount).toBeUndefined();
  });

  it('새 필드가 null 이어도 파싱한다', () => {
    const result = paymentListType.parse({
      payments: [
        {
          ...challengeRow,
          tossInfo: null,
          paymentItems: null,
          orderTotalPaidAmount: null,
          orderBalanceAmount: null,
        },
      ],
    });

    expect(result.payments[0].paymentItems).toBeNull();
  });

  it('LIVE_MENTORING 은 여전히 받는다', () => {
    const result = paymentListType.parse({
      payments: [
        {
          programInfo: {
            ...challengeRow.programInfo,
            programType: 'LIVE_MENTORING',
          },
        },
      ],
    });

    expect(result.payments[0].programInfo.programType).toBe('LIVE_MENTORING');
  });

  it('ONE_TIME_FORM 행을 파싱한다', () => {
    const result = paymentListType.parse({
      payments: [
        {
          programInfo: {
            ...challengeRow.programInfo,
            programType: 'ONE_TIME_FORM',
          },
          paymentItems: [{ ...paymentItems[0], programType: 'ONE_TIME_FORM' }],
        },
      ],
    });

    expect(result.payments[0].programInfo.programType).toBe('ONE_TIME_FORM');
    expect(result.payments[0].paymentItems?.[0].programType).toBe(
      'ONE_TIME_FORM',
    );
  });

  it('모르는 programType 은 여전히 거절한다', () => {
    const result = paymentListType.safeParse({
      payments: [
        {
          programInfo: { ...challengeRow.programInfo, programType: 'UNKNOWN' },
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});

describe('paymentDetailType — VOD_PASS 호환', () => {
  const detailBase = {
    programInfo: {
      id: 20,
      title: 'VOD 전체 이용권',
      programType: 'VOD_PASS',
      isCanceled: false,
      applicationId: 20,
    },
    priceInfo: { id: 1, price: 30000, discount: 0, refund: 0, option: 0 },
    paymentInfo: {
      id: 2,
      finalPrice: 30000,
      paybackPrice: 0,
      couponDiscount: 0,
    },
    tossInfo,
    accessMethod: null,
  };

  it('VOD_PASS 상세와 paymentItems 를 파싱한다', () => {
    const result = paymentDetailType.parse({
      ...detailBase,
      paymentItems,
      orderTotalPaidAmount: 130000,
      orderBalanceAmount: 130000,
    });

    expect(result.programInfo.programType).toBe('VOD_PASS');
    expect(result.paymentItems).toHaveLength(2);
    expect(result.orderTotalPaidAmount).toBe(130000);
    expect(result.orderBalanceAmount).toBe(130000);
  });

  it('새 필드가 없는 기존 상세도 그대로 파싱한다', () => {
    const result = paymentDetailType.parse({
      ...detailBase,
      programInfo: { ...detailBase.programInfo, programType: 'CHALLENGE' },
    });

    expect(result.programInfo.programType).toBe('CHALLENGE');
    expect(result.paymentItems).toBeUndefined();
    expect(result.planUpgradePaymentList).toEqual([]);
  });

  it('ONE_TIME_FORM 상세를 파싱한다', () => {
    const result = paymentDetailType.parse({
      ...detailBase,
      programInfo: { ...detailBase.programInfo, programType: 'ONE_TIME_FORM' },
    });

    expect(result.programInfo.programType).toBe('ONE_TIME_FORM');
  });

  it('REPORT 는 여전히 상세에서 거절한다', () => {
    const result = paymentDetailType.safeParse({
      ...detailBase,
      programInfo: { ...detailBase.programInfo, programType: 'REPORT' },
    });

    expect(result.success).toBe(false);
  });
});
