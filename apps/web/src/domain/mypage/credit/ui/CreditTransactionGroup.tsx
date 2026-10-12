import type { PaymentType } from '@/api/payment/paymentSchema';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import CardStatus from './CardStatus';
import { getCreditDetailHref, getReportThumbnail } from './CreditListItem';

const getItemStatus = ({ programInfo, tossInfo }: PaymentType) => {
  // 거래(`tossInfo`)는 묶음 전체의 것이라 일부만 취소돼도 PARTIAL_CANCELED 가 된다.
  // 항목별 상태는 신청 단위 플래그로 가르고, 거래 전체가 취소된 경우만 거래 상태를 따른다.
  if (programInfo.isRefunded) return 'REFUNDED';
  if (programInfo.isCanceled || tossInfo?.status === 'CANCELED') {
    return 'CANCELED';
  }
  return 'DONE';
};

const getItemTitle = ({ programInfo }: PaymentType) =>
  programInfo.title ||
  (programInfo.programType === 'VOD_PASS' ? 'VOD 이용권' : '');

/**
 * 같은 PG 거래로 결제한 행들을 한 카드로 보여준다 (LC-3438).
 * 카드사 청구는 한 건이므로 합계를 한 번만 보이고, 항목별 금액은 하위에 나열한다.
 * 항목을 누르면 해당 행의 결제 상세로 간다.
 */
export default function CreditTransactionGroup({
  payments,
}: {
  payments: PaymentType[];
}) {
  const [first] = payments;
  const paymentItems = first.paymentItems ?? [];

  // 거래 합계. 서버가 내려주지 않았던 구버전 응답은 PG 승인 금액을 쓴다.
  const totalAmount =
    first.orderTotalPaidAmount ?? first.tossInfo?.totalAmount ?? 0;

  // 이용권이 아닌 행의 이미지를 대표로 쓴다
  const representative =
    payments.find(
      ({ programInfo }) => programInfo.programType !== 'VOD_PASS',
    ) ?? first;
  const isRepresentativeCanceled = getItemStatus(representative) !== 'DONE';

  return (
    <div className="flex w-full items-start gap-x-[14px]">
      <img
        alt="thumbnail"
        src={
          representative.programInfo.programType === 'REPORT'
            ? getReportThumbnail(representative.programInfo.reportType || null)
            : representative.programInfo.thumbnail || ''
        }
        className={twMerge(
          'h-[97px] w-[137px] shrink-0 rounded-sm object-cover',
          isRepresentativeCanceled && 'grayscale',
        )}
      />
      <div className="flex grow flex-col gap-y-2">
        <ul className="flex flex-col gap-y-2">
          {payments.map((payment) => {
            const { programInfo } = payment;
            const amount =
              paymentItems.find(
                (item) => item.paymentId === programInfo.paymentId,
              )?.paidAmount ??
              programInfo.paidAmount ??
              0;

            return (
              <li key={programInfo.paymentId}>
                <Link
                  className="flex w-full flex-col items-start gap-y-1"
                  href={getCreditDetailHref(programInfo)}
                  data-program-text={programInfo.title}
                >
                  <CardStatus status={getItemStatus(payment)} />
                  <div className="text-neutral-0 text-xs font-semibold md:text-sm">
                    {getItemTitle(payment)}
                  </div>
                  <div className="text-neutral-0 text-xs font-medium md:text-sm">
                    {amount.toLocaleString()}원
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-neutral-80 flex w-full items-center justify-between border-t pt-2">
          <div className="text-neutral-40 text-xs font-medium">총 결제금액</div>
          <div className="text-neutral-0 text-sm font-semibold md:text-base">
            {totalAmount.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}
