import type { PaymentType } from '@/api/payment/paymentSchema';
import { groupPaymentsByTransaction } from './groupPaymentsByTransaction';

function makePayment(
  paymentId: number,
  paymentKey: string | null | undefined,
): PaymentType {
  return {
    programInfo: { paymentId, programType: 'CHALLENGE' },
    tossInfo: paymentKey === undefined ? null : { paymentKey },
  } as unknown as PaymentType;
}

const ids = (groups: PaymentType[][]) =>
  groups.map((group) => group.map((payment) => payment.programInfo.paymentId));

describe('groupPaymentsByTransaction', () => {
  it('같은 paymentKey 의 행을 한 묶음으로 만든다', () => {
    const groups = groupPaymentsByTransaction([
      makePayment(1, 'pk-A'),
      makePayment(2, 'pk-A'),
    ]);

    expect(ids(groups)).toEqual([[1, 2]]);
  });

  it('paymentKey 가 없는 행은 각각 단독 묶음이다', () => {
    const groups = groupPaymentsByTransaction([
      makePayment(1, undefined),
      makePayment(2, null),
      makePayment(3, ''),
    ]);

    expect(ids(groups)).toEqual([[1], [2], [3]]);
  });

  it('묶음 위치는 처음 나온 행 기준이고 입력 순서를 유지한다', () => {
    const groups = groupPaymentsByTransaction([
      makePayment(1, 'pk-A'),
      makePayment(2, 'pk-B'),
      makePayment(3, 'pk-A'),
      makePayment(4, undefined),
    ]);

    expect(ids(groups)).toEqual([[1, 3], [2], [4]]);
  });

  it('서로 다른 paymentKey 는 섞지 않는다', () => {
    const groups = groupPaymentsByTransaction([
      makePayment(1, 'pk-A'),
      makePayment(2, 'pk-B'),
    ]);

    expect(ids(groups)).toEqual([[1], [2]]);
  });

  it('빈 목록은 빈 묶음 목록이다', () => {
    expect(groupPaymentsByTransaction([])).toEqual([]);
  });
});
