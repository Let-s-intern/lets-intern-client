'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useConfirmLiveMentoringPaymentMutation } from '@/api/live-mentoring/liveMentoring';
import { formatPrice } from '../constants';
import { readServerError } from '../utils/serverError';
import { useOrderDraftStore } from './hooks/useOrderDraft';
import { formatReservationRange } from './utils';

/** 승인 실패 문구. 서버가 code 를 `UNKNOWN` 으로 주는 경로가 있어 문구를 그대로 쓴다. */
const DEFAULT_ERROR = '결제 승인에 실패했습니다. 결제 내역을 확인해 주세요.';

/**
 * 결제 성공 콜백 (`successUrl`).
 *
 * Toss 가 여기로 돌려보내면 서버에 승인을 요청한다. **승인이 끝나야 예약이 확정된다** —
 * 이 화면에 닿았다는 것만으로는 결제가 끝난 것이 아니다.
 *
 * 승인은 한 번만 부른다. 새로고침이나 리렌더로 두 번 부르면 이미 승인된 결제를 다시
 * 승인하려다 실패하고, 사용자에게는 성공한 결제가 실패로 보인다.
 */
const OrderResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const application = useOrderDraftStore((state) => state.application);
  const draft = useOrderDraftStore((state) => state.draft);

  const confirmPayment = useConfirmLiveMentoringPaymentMutation(
    application?.applicationId ?? 0,
  );
  const hasRequested = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasRequested.current) return;

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    /*
      신청 정보는 메모리에만 있다. 새로고침하면 사라지는데, 그때 승인을 다시 부를
      길이 없다. 이미 승인이 끝난 뒤일 수도 있어 상세로 돌려보내지 않고 안내만 남긴다.
    */
    if (!application) {
      setErrorMessage(
        '결제 정보를 확인할 수 없습니다. 마이페이지에서 신청 내역을 확인해 주세요.',
      );
      return;
    }
    if (!paymentKey || !orderId || !amount) {
      setErrorMessage(DEFAULT_ERROR);
      return;
    }

    hasRequested.current = true;
    // 요청의 amount 는 문자열이다. 응답에서는 숫자로 돌아온다 — 서버 DTO 가 그렇다.
    confirmPayment.mutate(
      { paymentKey, orderId, amount },
      {
        onError: (error) =>
          setErrorMessage(readServerError(error, DEFAULT_ERROR).message),
      },
    );
    // 검색 파라미터와 신청 정보가 갖춰진 첫 렌더에 한 번만 돈다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, searchParams]);

  const reservation = draft ? formatReservationRange(draft.slots) : null;

  if (errorMessage) {
    return (
      <div className="mw-1180 flex flex-col items-center gap-5 px-5 py-16 text-center">
        <h1 className="text-small20 text-neutral-0 font-bold">
          결제를 확인하지 못했습니다
        </h1>
        <p className="text-xsmall14 text-neutral-40">{errorMessage}</p>
        <Link
          href="/mypage/application"
          className="bg-primary text-xsmall16 rounded-sm px-6 py-3 font-medium text-white"
        >
          신청 내역 확인하기
        </Link>
      </div>
    );
  }

  if (confirmPayment.isPending || !confirmPayment.isSuccess) {
    return (
      <p className="text-neutral-40 py-20 text-center">결제를 확인하는 중…</p>
    );
  }

  return (
    <div className="mw-1180 flex flex-col items-center gap-6 px-5 py-16">
      <h1 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
        결제가 완료되었습니다!
      </h1>

      <dl className="bg-neutral-95 text-xsmall14 flex w-full max-w-[480px] flex-col gap-3 rounded-md px-5 py-5">
        <div className="flex items-center justify-between">
          <dt className="text-neutral-40">상품</dt>
          <dd className="text-neutral-0 font-medium">
            {application?.orderName}
          </dd>
        </div>
        {reservation && (
          <div className="flex items-center justify-between">
            <dt className="text-neutral-40">예약 일시</dt>
            <dd className="text-neutral-0 font-medium">{reservation}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-neutral-40">결제 금액</dt>
          <dd className="text-neutral-0 font-bold">
            {formatPrice(confirmPayment.data.amount)}
          </dd>
        </div>
      </dl>

      <div className="flex w-full max-w-[480px] gap-3">
        <button
          type="button"
          onClick={() => router.push(`/live-mentoring/${draft?.mentorId ?? ''}`)}
          className="border-primary text-primary text-xsmall16 flex-1 rounded-sm border py-3 font-medium"
        >
          멘토 페이지로
        </button>
        <Link
          href="/mypage/application"
          className="bg-primary text-xsmall16 flex-1 rounded-sm py-3 text-center font-medium text-white"
        >
          신청 내역 확인하기
        </Link>
      </div>
    </div>
  );
};

export default OrderResultPage;
