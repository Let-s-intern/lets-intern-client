import type { PaymentDetailType } from '@/api/payment/paymentSchema';
import { scopePaymentDetailToRow } from './bundledPayment';

const CHALLENGE_PAYMENT_ID = 501;
const PASS_PAYMENT_ID = 502;

function makeDetail({
  rowIsCanceled = false,
  finalPrice = 60000,
  transactionStatus = 'DONE',
  balanceAmount = 89000,
  paymentItems = [
    { paymentId: CHALLENGE_PAYMENT_ID, paidAmount: 60000 },
    { paymentId: PASS_PAYMENT_ID, paidAmount: 29000 },
  ],
}: {
  rowIsCanceled?: boolean;
  finalPrice?: number;
  transactionStatus?: string;
  balanceAmount?: number;
  paymentItems?: PaymentDetailType['paymentItems'];
} = {}): PaymentDetailType {
  return {
    programInfo: { programType: 'CHALLENGE', isCanceled: rowIsCanceled },
    priceInfo: {},
    paymentInfo: { finalPrice },
    tossInfo: {
      status: transactionStatus,
      totalAmount: 89000,
      balanceAmount,
      requestedAt: '2026-10-12T10:00:00',
    },
    paymentItems,
    planUpgradePaymentList: [],
  } as unknown as PaymentDetailType;
}

describe('scopePaymentDetailToRow', () => {
  it('묶음이 아니면 원본을 그대로 돌려준다', () => {
    const single = makeDetail({
      paymentItems: [{ paymentId: CHALLENGE_PAYMENT_ID, paidAmount: 89000 }],
    });
    const empty = makeDetail({ paymentItems: [] });
    const missing = makeDetail({ paymentItems: null });

    expect(scopePaymentDetailToRow(single, CHALLENGE_PAYMENT_ID)).toBe(single);
    expect(scopePaymentDetailToRow(empty, CHALLENGE_PAYMENT_ID)).toBe(empty);
    expect(scopePaymentDetailToRow(missing, CHALLENGE_PAYMENT_ID)).toBe(
      missing,
    );
  });

  it('PG 정보가 없으면 원본을 그대로 돌려준다', () => {
    const detail = makeDetail();
    detail.tossInfo = null;

    expect(scopePaymentDetailToRow(detail, CHALLENGE_PAYMENT_ID)).toBe(detail);
  });

  it('이 행을 항목에서 찾지 못하면 원본을 그대로 돌려준다', () => {
    const detail = makeDetail();

    expect(scopePaymentDetailToRow(detail, 999)).toBe(detail);
  });

  it('합계와 잔액을 거래 전체가 아니라 이 행의 금액으로 바꾼다', () => {
    const scoped = scopePaymentDetailToRow(makeDetail(), CHALLENGE_PAYMENT_ID);

    expect(scoped.tossInfo?.totalAmount).toBe(60000);
    expect(scoped.tossInfo?.balanceAmount).toBe(60000);
    expect(scoped.tossInfo?.status).toBe('DONE');
    // 그 밖의 거래 정보는 그대로 둔다
    expect(scoped.tossInfo?.requestedAt).toBe('2026-10-12T10:00:00');
  });

  it('원본 응답 객체를 바꾸지 않는다', () => {
    const detail = makeDetail();

    scopePaymentDetailToRow(detail, CHALLENGE_PAYMENT_ID);

    expect(detail.tossInfo?.totalAmount).toBe(89000);
  });

  it('이용권만 환불돼 거래가 PARTIAL_CANCELED 여도 챌린지 행은 결제 완료로 본다', () => {
    const detail = makeDetail({
      transactionStatus: 'PARTIAL_CANCELED',
      balanceAmount: 60000,
    });

    const scoped = scopePaymentDetailToRow(detail, CHALLENGE_PAYMENT_ID);

    expect(scoped.tossInfo?.status).toBe('DONE');
    expect(scoped.tossInfo?.balanceAmount).toBe(60000);
  });

  it('환불된 행은 환불액만큼 잔액을 줄이고 취소 상태로 본다', () => {
    // 이용권(29,000원)이 전액 환불된 뒤의 이용권 행
    const detail = makeDetail({
      rowIsCanceled: true,
      finalPrice: 29000,
      transactionStatus: 'PARTIAL_CANCELED',
      balanceAmount: 60000,
    });

    const scoped = scopePaymentDetailToRow(detail, PASS_PAYMENT_ID);

    expect(scoped.tossInfo?.totalAmount).toBe(29000);
    expect(scoped.tossInfo?.balanceAmount).toBe(0);
    expect(scoped.tossInfo?.status).toBe('PARTIAL_CANCELED');
  });

  it('거래 상태가 DONE 인데 행만 취소됐다면 취소 상태로 바꾼다', () => {
    const detail = makeDetail({
      rowIsCanceled: true,
      finalPrice: 0,
      transactionStatus: 'DONE',
    });

    const scoped = scopePaymentDetailToRow(detail, CHALLENGE_PAYMENT_ID);

    expect(scoped.tossInfo?.status).toBe('CANCELED');
    expect(scoped.tossInfo?.balanceAmount).toBe(60000);
  });
});
