import type { RefundMode } from '@/domain/admin/program/program-user/ui/RefundModal';
import type { UserApplicationDetailInfo } from '@/schema';
import {
  formatCouponLabel,
  formatPaymentDate,
  formatPeriod,
  formatWon,
  planLabel,
  programTypeLabel,
  type PurchaseStatus,
} from '../utils/purchaseHistory';

interface Props {
  item: UserApplicationDetailInfo;
  status: PurchaseStatus;
  /** 환불할 수 있는 행에만 준다. */
  refund?: {
    canPartialRefund: boolean;
    onRefund: (mode: RefundMode) => void;
  };
}

/** 신청 하나의 결제·기간 값. 상태는 색이 아니라 글자로 적는다. */
const PurchaseHistoryRow = ({ item, status, refund }: Props) => (
  <li className="rounded-xs border border-[#E4E4E7] p-4">
    <div className="flex items-start justify-between gap-x-4">
      <div>
        <div className="text-sm text-neutral-500">
          {programTypeLabel(item.programType)}
        </div>
        <h3 className="font-semibold">{item.programTitle ?? '-'}</h3>
      </div>
      <span className="shrink-0 rounded-xs border border-neutral-300 px-2 py-0.5 text-sm">
        {status}
      </span>
    </div>

    <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
      <dt className="text-neutral-500">기간</dt>
      <dd>{formatPeriod(item.programStartDate, item.programEndDate)}</dd>

      <dt className="text-neutral-500">신청·결제일</dt>
      <dd>{formatPaymentDate(item.paymentCreateDate)}</dd>

      <dt className="text-neutral-500">주문번호</dt>
      <dd>{item.orderId || '-'}</dd>

      <dt className="text-neutral-500">정가</dt>
      <dd>{formatWon(item.programPrice)}</dd>

      <dt className="text-neutral-500">쿠폰</dt>
      <dd>{formatCouponLabel(item.couponName, item.couponDiscount)}</dd>

      <dt className="text-neutral-500">실결제액</dt>
      <dd className="font-semibold">{formatWon(item.finalPrice)}</dd>

      {item.challengePricePlanType && (
        <>
          <dt className="text-neutral-500">플랜</dt>
          <dd>{planLabel(item.challengePricePlanType)}</dd>
        </>
      )}

      {!!item.additionalPaidAmount && (
        <>
          <dt className="text-neutral-500">플랜 변경 추가 결제</dt>
          <dd>{formatWon(item.additionalPaidAmount)}</dd>
        </>
      )}
    </dl>

    {refund && (
      <div className="mt-3 flex gap-x-2">
        <button
          type="button"
          className="rounded-xs border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          onClick={() => refund.onRefund('full')}
        >
          전체 환불
        </button>
        <button
          type="button"
          className="rounded-xs border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent"
          onClick={() => refund.onRefund('partial')}
          disabled={!refund.canPartialRefund}
          title={
            refund.canPartialRefund
              ? undefined
              : '실결제액이 0원이라 나눌 금액이 없습니다.'
          }
        >
          부분 환불
        </button>
      </div>
    )}
  </li>
);

export default PurchaseHistoryRow;
