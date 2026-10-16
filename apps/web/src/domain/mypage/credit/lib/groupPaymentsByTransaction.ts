import type { PaymentType } from '@/api/payment/paymentSchema';

/**
 * 같은 PG 거래(`tossInfo.paymentKey`)의 결제 행을 한 묶음으로 만든다 (LC-3438).
 *
 * 챌린지와 VOD 이용권을 함께 결제하면 BE 가 결제 행을 둘로 내려주고 두 행이 같은
 * `tossInfo` 를 가진다. 그대로 그리면 카드 결제 한 번이 두 줄로 보여 이중 결제로 오해한다.
 *
 * - `paymentKey` 가 없는 행(0원 결제, 무통장 등)은 각각 단독 묶음이다
 * - 묶음의 순서와 묶음 안의 순서는 입력 순서를 따른다 (묶음 위치는 처음 나온 행 기준)
 */
export function groupPaymentsByTransaction(
  payments: PaymentType[],
): PaymentType[][] {
  const groups: PaymentType[][] = [];
  const groupByPaymentKey = new Map<string, PaymentType[]>();

  for (const payment of payments) {
    const paymentKey = payment.tossInfo?.paymentKey;

    if (!paymentKey) {
      groups.push([payment]);
      continue;
    }

    const existing = groupByPaymentKey.get(paymentKey);
    if (existing) {
      existing.push(payment);
      continue;
    }

    const group = [payment];
    groupByPaymentKey.set(paymentKey, group);
    groups.push(group);
  }

  return groups;
}
