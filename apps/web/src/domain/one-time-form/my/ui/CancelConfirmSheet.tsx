import type { MyOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import { formatWon } from '../../payment/utils/paymentAmount';
import { lineButtonClass } from '../../ui/states/StateScreen';

interface CancelConfirmSheetProps {
  /** 무료 폼이면 null. 그때는 환불 금액을 그리지 않는다 */
  payment: NonNullable<MyOneTimeFormApplication>['payment'];
  isPending: boolean;
  /** 실패 안내. 없으면 그리지 않는다 */
  errorMessage?: string;
  /** 다시 시도해도 안 되는 실패(마감 지남, 이미 취소)면 취소하기를 막는다 */
  isConfirmBlocked: boolean;
  onKeep: () => void;
  onConfirm: () => void;
}

const dangerButtonClass =
  'bg-system-error text-xsmall16 text-static-100 grid h-[52px] w-full place-items-center rounded-sm font-semibold transition-opacity disabled:opacity-50';

/**
 * 취소 확인 바텀시트(시안 5절 "취소 확인"). 취소는 전액 환불이라(계약 7절) 결제 금액이 곧 환불 금액이다.
 * 0원은 돌려줄 돈이 없어 환불 수단 안내를 뺀다.
 */
const CancelConfirmSheet = ({
  payment,
  isPending,
  errorMessage,
  isConfirmBlocked,
  onKeep,
  onConfirm,
}: CancelConfirmSheetProps) => (
  <div className="bg-neutral-0/50 fixed inset-0 z-50 flex items-end justify-center">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-confirm-title"
      className="bg-static-100 w-full max-w-[480px] rounded-t-lg px-5 pb-5 pt-7"
    >
      <h3 id="cancel-confirm-title" className="text-small20 font-bold">
        신청을 취소할까요?
      </h3>
      <p className="text-xsmall14 text-neutral-35 mt-2 break-keep leading-relaxed">
        취소하면 되돌릴 수 없고, 다시 신청하려면 처음부터 작성해야 해요.
      </p>

      {payment ? (
        <>
          <dl className="border-neutral-85 mt-5 rounded-md border p-4">
            <div className="text-xsmall14 flex justify-between">
              <dt className="text-neutral-40">결제 금액</dt>
              <dd className="text-neutral-0">
                {formatWon(payment.paidAmount)}
              </dd>
            </div>
            <div className="border-neutral-85 mt-2.5 flex items-center justify-between border-t pt-2.5">
              <dt className="text-xsmall14 text-neutral-0 font-semibold">
                환불 금액
              </dt>
              <dd className="text-small18 text-primary font-bold">
                {formatWon(payment.paidAmount)}
              </dd>
            </div>
          </dl>
          {payment.paidAmount > 0 ? (
            <p className="text-xxsmall12 text-neutral-40 mt-2 break-keep">
              결제한 수단으로 돌려드려요. 카드사에 따라 며칠 걸릴 수 있어요.
            </p>
          ) : null}
        </>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="text-xsmall14 text-system-error mt-3 break-keep"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onKeep} className={lineButtonClass}>
          유지하기
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending || isConfirmBlocked}
          className={dangerButtonClass}
        >
          취소하기
        </button>
      </div>
    </div>
  </div>
);

export default CancelConfirmSheet;
