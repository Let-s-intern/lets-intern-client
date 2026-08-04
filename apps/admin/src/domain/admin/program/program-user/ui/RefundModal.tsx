import { AdminRefundRequest } from '@/api/adminRefund';
import { ChallengePricePlanEnum } from '@/schema';
import { useMemo, useState } from 'react';

/** 실행 전에 그대로 입력해야 하는 문장. 클릭 두 번으로 남의 결제가 취소되는 것을 막는다. */
export const CONFIRM_SENTENCE =
  '이 유저를 전체 환불 시킵니다. 이 유저는 대시보드에 입장할 수 없습니다.';

export interface RefundTarget {
  applicationId: number;
  name: string;
  email: string;
  phoneNum: string;
  programTitle: string;
  orderId: string;
  pricePlanType: string | null;
  couponName: string | null;
  couponDiscount: number | null;
  finalPrice: number;
}

interface RefundModalProps {
  target: RefundTarget;
  isSubmitting: boolean;
  onSubmit: (body: AdminRefundRequest) => void;
  onClose: () => void;
}

/** 공백·줄바꿈 차이로 막히지 않도록 정규화 후 비교한다. */
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

/**
 * 쿠폰 할인 -1 은 금액이 아니라 "100% 할인" 센티널이다.
 * 그대로 뿌리면 `-1원` 으로 보인다.
 */
const formatCoupon = (name: string | null, discount: number | null) => {
  if (!name) return '없음';
  if (discount === -1) return `${name} (100% 할인)`;
  if (discount == null) return name;
  return `${name} (${discount.toLocaleString()}원 할인)`;
};

const planLabel: Record<string, string> = {
  [ChallengePricePlanEnum.enum.BASIC]: '베이직',
  [ChallengePricePlanEnum.enum.STANDARD]: '스탠다드',
  [ChallengePricePlanEnum.enum.PREMIUM]: '프리미엄',
  [ChallengePricePlanEnum.enum.LIGHT]: '라이트',
};

const RefundModal = ({
  target,
  isSubmitting,
  onSubmit,
  onClose,
}: RefundModalProps) => {
  const [managerName, setManagerName] = useState('');
  const [reason, setReason] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [confirmText, setConfirmText] = useState('');

  const canSubmit = useMemo(
    () =>
      !isSubmitting &&
      managerName.trim().length > 0 &&
      reason.trim().length > 0 &&
      normalize(confirmText) === normalize(CONFIRM_SENTENCE),
    [isSubmitting, managerName, reason, confirmText],
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      managerName: managerName.trim(),
      reason: reason.trim(),
      sendNotification,
      refundAmount: target.finalPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white p-6">
        <h2 className="text-1.25-bold mb-4">전액 환불</h2>

        <dl className="mb-5 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
          <dt className="text-neutral-500">참여자</dt>
          <dd>
            {target.name} ({target.email} / {target.phoneNum})
          </dd>

          <dt className="text-neutral-500">프로그램</dt>
          <dd>{target.programTitle}</dd>

          <dt className="text-neutral-500">주문번호</dt>
          <dd>{target.orderId || '없음'}</dd>

          {target.pricePlanType && (
            <>
              <dt className="text-neutral-500">결제 플랜</dt>
              <dd>{planLabel[target.pricePlanType] ?? target.pricePlanType}</dd>
            </>
          )}

          <dt className="text-neutral-500">쿠폰</dt>
          <dd>{formatCoupon(target.couponName, target.couponDiscount)}</dd>

          <dt className="text-neutral-500">환불 금액</dt>
          <dd className="font-bold">
            {target.finalPrice > 0
              ? `${target.finalPrice.toLocaleString()}원 (실결제액 전액)`
              : '0원 (결제 금액 없음)'}
          </dd>
        </dl>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-500">담당자</span>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="환불을 진행하는 담당자 이름"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-500">환불 사유</span>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="예) 프로그램 오결제 — 경력자Ver 재결제 예정"
          />
        </label>

        <label className="mb-5 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sendNotification}
            onChange={(e) => setSendNotification(e.target.checked)}
          />
          환불 안내 알림톡 발송
        </label>

        <div className="mb-5 rounded bg-neutral-100 p-3">
          <p className="mb-2 text-sm text-neutral-600">
            아래 문장을 그대로 입력해야 실행됩니다.
          </p>
          <p className="mb-2 text-sm font-medium">{CONFIRM_SENTENCE}</p>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded border border-neutral-300 px-4 py-2 text-sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            닫기
          </button>
          <button
            type="button"
            className="rounded bg-red-600 px-4 py-2 text-sm text-white disabled:bg-neutral-300"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? '환불 처리 중...' : '환불 실행'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
