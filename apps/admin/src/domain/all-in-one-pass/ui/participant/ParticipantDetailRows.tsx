import {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import {
  resolveRefundableState,
  resolveRefundLabel,
} from '@/domain/admin/program/program-user/utils/refundState';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import { periodKindLabel } from '@/domain/all-in-one-pass/util/periodKindLabel';
import dayjs from '@/lib/dayjs';

const SUB_HEAD =
  'border border-[#cbd5e0] bg-primary-10 px-3 py-2 text-center text-xs font-semibold text-neutral-600';
const SUB_CELL = 'border border-[#cbd5e0] px-3 py-2 text-center text-xs';

const BOLD_T = 'border-t-2 border-t-primary-40';
const BOLD_B = 'border-b-2 border-b-primary-40';
const BOLD_L = 'border-l-2 border-l-primary-40';
const BOLD_R = 'border-r-2 border-r-primary-40';

export const appAmount = (p: PassParticipant) =>
  p.isCanceled ? (p.originalPrice ?? p.finalPrice) : p.finalPrice;

interface Props {
  apps: PassParticipant[];
  onRefundClick: (target: RefundTarget, mode: RefundMode) => void;
  refundTargetOf: (p: PassParticipant) => RefundTarget;
}

/** 참여자 건별(최초/연장) 내역 행들. 메인 테이블의 <tr> 로 직접 렌더해 컬럼을 공유한다. */
export default function ParticipantDetailRows({
  apps,
  onRefundClick,
  refundTargetOf,
}: Props) {
  return (
    <>
      <tr>
        <td />
        <td className={`${SUB_HEAD} ${BOLD_T} ${BOLD_L}`}>구분</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>주문번호</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>결제일</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>쿠폰명</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>결제금액</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>환불여부</td>
        <td className={`${SUB_HEAD} ${BOLD_T} ${BOLD_R}`}>관리</td>
      </tr>
      {apps.map((p, index) => {
        const amount = appAmount(p);
        const refundLabel = resolveRefundLabel({
          isCanceled: p.isCanceled,
          isAdminRefunded: p.isAdminRefunded,
          finalPrice: p.finalPrice,
          originalPrice: p.originalPrice,
        });
        const refundable = resolveRefundableState({
          isCanceled: p.isCanceled,
          hasUser: !!p.name,
          finalPrice: p.finalPrice,
        });

        const isLast = index === apps.length - 1;
        const edge = isLast ? ` ${BOLD_B}` : '';

        return (
          <tr key={p.id}>
            <td />
            <td className={`${SUB_CELL} ${BOLD_L}${edge}`}>
              <span
                className={`text-xxsmall12 inline-block whitespace-nowrap rounded-full border px-2 py-0.5 font-medium ${
                  index === 0
                    ? 'border-neutral-70 text-neutral-40'
                    : 'border-primary text-primary'
                }`}
              >
                {periodKindLabel(index, p.extendedDays, '기본')}
              </span>
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {p.orderId}
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {dayjs(p.createDate).format('YYYY.MM.DD')}
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {p.couponName ?? '없음'}
            </td>
            <td className={`${SUB_CELL}${edge}`}>
              {amount.toLocaleString()}원
            </td>
            <td className={`${SUB_CELL}${edge}`}>
              {refundLabel.isAdmin ? (
                <span className="font-bold text-red-600">
                  {refundLabel.text}
                </span>
              ) : refundLabel.isRefunded ? (
                <span className="font-medium">{refundLabel.text}</span>
              ) : (
                <span className="text-gray-300">{refundLabel.text}</span>
              )}
            </td>
            <td className={`${SUB_CELL} ${BOLD_R}${edge}`}>
              {refundable.canRefund ? (
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => onRefundClick(refundTargetOf(p), 'full')}
                  >
                    환불
                  </button>
                  <button
                    type="button"
                    className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent"
                    onClick={() => onRefundClick(refundTargetOf(p), 'partial')}
                    disabled={!refundable.canPartialRefund}
                    title={
                      refundable.canPartialRefund
                        ? undefined
                        : '실결제액이 0원이라 나눌 금액이 없습니다.'
                    }
                  >
                    부분환불
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-400">
                  {refundable.reason}
                </span>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}
