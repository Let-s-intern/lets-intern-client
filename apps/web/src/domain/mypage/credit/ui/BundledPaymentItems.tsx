import type { PaymentDetailType } from '@/api/payment/paymentSchema';
import Link from 'next/link';
import { getCreditDetailHref } from './CreditListItem';

type PaymentItem = NonNullable<PaymentDetailType['paymentItems']>[number];

const getItemTitle = ({ title, programType }: PaymentItem) =>
  title || (programType === 'VOD_PASS' ? 'VOD 이용권' : '');

/**
 * 같은 PG 거래로 함께 결제한 다른 항목 (LC-3438).
 * 항목을 누르면 그 항목의 결제 상세로 간다. 함께 결제한 항목이 없으면 그리지 않는다.
 */
export default function BundledPaymentItems({
  items,
  currentPaymentId,
  totalAmount,
}: {
  items: PaymentDetailType['paymentItems'];
  currentPaymentId: number;
  totalAmount: number;
}) {
  const others = (items ?? []).filter(
    (item) => item.paymentId !== currentPaymentId,
  );

  if (others.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-col items-start gap-y-3">
      <div className="font-semibold text-neutral-0">함께 결제한 항목</div>
      <ul className="flex w-full flex-col gap-y-2">
        {others.map((item) => (
          <li key={item.paymentId}>
            <Link
              className="flex w-full items-center justify-between gap-x-3 text-sm"
              href={getCreditDetailHref(item)}
            >
              <span className="font-medium text-neutral-0">
                {getItemTitle(item)}
                {item.isCanceled && (
                  <span className="text-neutral-40"> (결제취소)</span>
                )}
              </span>
              <span className="shrink-0 font-semibold text-neutral-0">
                {(item.paidAmount ?? 0).toLocaleString()}원
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex w-full items-center justify-between border-t pt-2 text-xs font-medium text-neutral-40">
        <span>한 번에 결제한 합계</span>
        <span>{totalAmount.toLocaleString()}원</span>
      </div>
    </section>
  );
}
