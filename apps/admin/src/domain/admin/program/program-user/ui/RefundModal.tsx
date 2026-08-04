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
}

/**
 * 전체 환불과 부분 환불은 요청 자체가 다르다.
 *
 * `full` 은 금액을 보내지 않고 서버가 payment.finalPrice 를 쓴다. 0원 결제도 이 경로로만
 * 취소할 수 있다. `partial` 은 금액을 보내고 서버가 실결제액 미만인지 검증한다.
 */
export type RefundMode = 'full' | 'partial';

interface RefundModalProps {
  target: RefundTarget;
  mode: RefundMode;
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
  mode,
  isSubmitting,
  onSubmit,
  onClose,
}: RefundModalProps) => {
  const [managerName, setManagerName] = useState('');
  const [reason, setReason] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [confirmText, setConfirmText] = useState('');
  // 부분 환불은 CS 협의값을 직접 넣는다. 실결제액을 기본값으로 채우면 그 값이 곧
  // 거절 대상(전액)이라 지우고 다시 입력하는 손이 한 번 더 든다.
  const [amountInput, setAmountInput] = useState('');

  const isFull = mode === 'full';
  const refundAmount = amountInput === '' ? 0 : Number(amountInput);

  /**
   * 규정상 환불액을 계산해 보여주지 않는다.
   * 어드민 환불은 애초에 규정을 무시하는 작업이라 규정값이 판단 근거가 되지 않는다.
   * 금액은 CS 협의값이고 화면은 상한(실결제액)만 알려준다.
   *
   * 상한이 실결제액 "미만"이다. 같은 금액은 서버가 거절한다 — 전체 환불 버튼을 쓰라는 뜻이다.
   */
  const amountError = useMemo(() => {
    // 아직 입력하지 않은 칸을 틀렸다고 하지 않는다. 실행은 canSubmit 이 따로 막는다.
    if (isFull || amountInput === '') return null;
    if (refundAmount <= 0) return '환불 금액은 1원 이상이어야 합니다.';
    if (refundAmount >= target.finalPrice) {
      return `실결제액 ${target.finalPrice.toLocaleString()}원보다 적어야 합니다. 전액이면 환불 버튼을 사용하세요.`;
    }
    return null;
  }, [isFull, amountInput, refundAmount, target.finalPrice]);

  /** 환불 금액이 확정됐는가. 확정 전에는 확인 문장을 내걸 수 없다. */
  const amountSettled = isFull || (amountInput !== '' && !amountError);

  const confirmSentence = buildRefundConfirmSentence({
    isFullRefund: isFull,
    refundAmount,
  });

  const canSubmit = useMemo(
    () =>
      !isSubmitting &&
      amountSettled &&
      managerName.trim().length > 0 &&
      reason.trim().length > 0 &&
      normalize(confirmText) === normalize(confirmSentence),
    [
      isSubmitting,
      amountSettled,
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
      // 전체 환불은 금액 키 자체를 보내지 않는다. 서버가 payment.finalPrice 를 쓰므로
      // 화면이 읽은 값과 실제 결제액이 어긋날 여지가 없고, 0원 결제도 같은 경로로 취소된다.
      ...(isFull ? {} : { refundAmount }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white p-6">
        <h2 className="text-1.25-bold mb-4">
          {isFull ? '전체 환불' : '부분 환불'}
        </h2>

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

        {isFull ? (
          <div className="mb-3 rounded bg-neutral-100 p-3 text-sm">
            <p>실결제액 전액을 환불합니다.</p>
            {target.finalPrice === 0 && (
              // 100% 할인 쿠폰과 어드민 테스트 참여가 이 경로로 취소된다.
              // 서버가 PG 를 호출하지 않아 "성공했는데 돈이 안 나감"이 정상 결과다.
              <p className="mt-1 text-neutral-600">
                실결제액이 0원이라 PG 취소 없이 참여만 취소됩니다.
              </p>
            )}
          </div>
        ) : (
          <div className="mb-3">
            <span className="mb-1 block text-sm text-neutral-500">
              환불 금액
            </span>
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
            </div>
            {amountError ? (
              <p className="mt-1 text-sm text-red-600">{amountError}</p>
            ) : (
              <p className="mt-1 text-sm text-neutral-500">
                실결제액 {target.finalPrice.toLocaleString()}원보다 적은 금액을
                입력하세요.
              </p>
            )}
          </div>
        )}

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
          {/*
            금액이 정해지기 전에는 문장을 내걸지 않는다. 문장에 금액이 들어가는데
            빈 칸을 0 으로 읽어 "0원을 환불합니다"를 요구하면 실제 결과와 어긋난다.
          */}
          {amountSettled ? (
            <p className="mb-2 text-sm font-medium">{confirmSentence}</p>
          ) : (
            <p className="mb-2 text-sm text-neutral-500">
              환불 금액을 먼저 입력하세요.
            </p>
          )}
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
            {isSubmitting ? '환불 처리 중...' : '환불 실행'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
