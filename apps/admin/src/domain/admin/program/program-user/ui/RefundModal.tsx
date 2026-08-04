import { AdminRefundRequest } from '@/api/adminRefund';
import { ChallengePricePlanEnum } from '@/schema';
import { useMemo, useState } from 'react';
import { buildRefundConfirmSentence } from '../utils/refundConfirm';

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
  /**
   * 함께 지워질 미션 제출물 건수.
   *
   * 챌린지가 아니면 제출물 개념이 없고, 참여자 목록 API 가 아직 건수를 내려주지 않아
   * 그 경우 null 이다. null 이면 건수 없이 항목만 알린다.
   */
  submittedMissionCount: number | null;
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

/**
 * 무엇이 지워지는지 알린다.
 *
 * 건수를 알면 함께 적는다. 개수가 있어야 운영이 무게를 안다.
 */
const deletionScopeText = (submittedMissionCount: number | null) =>
  submittedMissionCount == null
    ? '신청 기록·결제 기록·제출한 미션이 함께 지워집니다.'
    : `신청 기록·결제 기록·제출한 미션 ${submittedMissionCount}건이 함께 지워집니다.`;

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
  // 기본값은 실결제액이다. 대부분의 건이 전액이라 그대로 실행하는 쪽이 오타를 줄인다.
  const [amountInput, setAmountInput] = useState(String(target.finalPrice));
  // 기본 꺼짐. 꺼진 상태에서는 시선을 끌지 않고, 켰을 때만 위험을 강조한다.
  const [hardDelete, setHardDelete] = useState(false);

  const refundAmount = amountInput === '' ? 0 : Number(amountInput);

  /**
   * 규정상 환불액을 계산해 보여주지 않는다.
   * 어드민 환불은 애초에 규정을 무시하는 작업이라 규정값이 판단 근거가 되지 않는다.
   * 금액은 CS 협의값이고 화면은 상한(실결제액)만 알려준다.
   */
  const amountError = useMemo(() => {
    if (refundAmount <= 0) return '환불 금액은 1원 이상이어야 합니다.';
    if (refundAmount > target.finalPrice) {
      return `실결제액 ${target.finalPrice.toLocaleString()}원을 넘을 수 없습니다.`;
    }
    return null;
  }, [refundAmount, target.finalPrice]);

  const confirmSentence = buildRefundConfirmSentence({
    isFullRefund: refundAmount === target.finalPrice,
    refundAmount,
    hardDelete,
  });

  /**
   * 체크 상태를 바꾸면 이미 입력한 확인 문장을 비운다.
   *
   * 안 비우면 삭제를 끈 상태의 문장을 넣어두고 체크만 켜서 통과시킬 수 있다.
   */
  const handleHardDeleteChange = (checked: boolean) => {
    setHardDelete(checked);
    setConfirmText('');
  };

  const canSubmit = useMemo(
    () =>
      !isSubmitting &&
      !amountError &&
      managerName.trim().length > 0 &&
      reason.trim().length > 0 &&
      normalize(confirmText) === normalize(confirmSentence),
    [
      isSubmitting,
      amountError,
      managerName,
      reason,
      confirmText,
      confirmSentence,
    ],
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      managerName: managerName.trim(),
      reason: reason.trim(),
      sendNotification,
      refundAmount,
      hardDelete,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white p-6">
        <h2 className="text-1.25-bold mb-4">환불</h2>

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

          <dt className="text-neutral-500">실결제액</dt>
          <dd className="font-bold">{target.finalPrice.toLocaleString()}원</dd>
        </dl>

        <div className="mb-3">
          <span className="mb-1 block text-sm text-neutral-500">환불 금액</span>
          <div className="flex items-center gap-2">
            <input
              className="w-40 rounded border border-neutral-300 px-3 py-2 text-right text-sm"
              inputMode="numeric"
              aria-label="환불 금액"
              value={amountInput === '' ? '' : refundAmount.toLocaleString()}
              onChange={(e) =>
                setAmountInput(e.target.value.replace(/[^0-9]/g, ''))
              }
            />
            <span className="text-sm">원</span>
            <button
              type="button"
              className="rounded border border-neutral-300 px-3 py-2 text-sm"
              onClick={() => setAmountInput(String(target.finalPrice))}
            >
              전액
            </button>
          </div>
          {amountError ? (
            <p className="mt-1 text-sm text-red-600">{amountError}</p>
          ) : (
            <p className="mt-1 text-sm text-neutral-500">
              최대 {target.finalPrice.toLocaleString()}원까지 환불할 수
              있습니다.
            </p>
          )}
        </div>

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

        <div className="mb-5 border-t border-neutral-200 pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hardDelete}
              onChange={(e) => handleHardDeleteChange(e.target.checked)}
            />
            참여자를 목록에서 완전히 삭제
          </label>

          {hardDelete && (
            <ul className="mt-2 space-y-1 rounded bg-red-50 p-3 text-sm text-red-700">
              <li>{deletionScopeText(target.submittedMissionCount)}</li>
              <li>되돌릴 수 없고 환불 히스토리에만 남습니다.</li>
              <li>
                환불한 뒤에는 이 창을 다시 열 수 없어 나중에 삭제할 수 없습니다.
              </li>
            </ul>
          )}
        </div>

        <div className="mb-5 rounded bg-neutral-100 p-3">
          <p className="mb-2 text-sm text-neutral-600">
            아래 문장을 그대로 입력해야 실행됩니다.
          </p>
          <p className="mb-2 text-sm font-medium">{confirmSentence}</p>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            aria-label="확인 문장"
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
            {isSubmitting
              ? '환불 처리 중...'
              : hardDelete
                ? '환불 후 삭제'
                : '환불 실행'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
