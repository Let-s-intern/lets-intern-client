'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useOrderDraftStore } from './hooks/useOrderDraft';

/**
 * 결제 실패 콜백 (`failUrl`).
 *
 * Toss 가 `code` 와 `message` 를 쿼리로 돌려준다. 사용자가 결제창을 닫은 것도 여기로 온다.
 *
 * **슬롯 선점은 그대로 남아 있다.** 신청은 이미 만들어졌고 10분 뒤 서버가 되돌린다.
 * 그래서 "다시 결제" 는 새 신청을 만드는 것이 아니라 만들어 둔 신청의 결제창을
 * 다시 여는 것이다 — 그 경로를 남겨 둔다.
 */
const OrderFailPage = () => {
  const searchParams = useSearchParams();
  const application = useOrderDraftStore((state) => state.application);
  const draft = useOrderDraftStore((state) => state.draft);

  const message =
    searchParams.get('message') ??
    '결제가 완료되지 않았습니다. 다시 시도해 주세요.';
  const code = searchParams.get('code');

  return (
    <div className="mw-1180 flex flex-col items-center gap-5 px-5 py-16 text-center">
      <h1 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
        결제가 완료되지 않았습니다
      </h1>

      <p className="text-xsmall14 text-neutral-40">{message}</p>
      {code && (
        <p className="text-xxsmall12 text-neutral-45">오류 코드: {code}</p>
      )}

      <div className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row">
        {application ? (
          <Link
            href="/live-mentoring/order/payment"
            className="bg-primary text-xsmall16 flex-1 rounded-sm py-3 font-medium text-white"
          >
            다시 결제하기
          </Link>
        ) : (
          <Link
            href={`/live-mentoring/${draft?.mentorId ?? ''}`}
            className="bg-primary text-xsmall16 flex-1 rounded-sm py-3 font-medium text-white"
          >
            다시 신청하기
          </Link>
        )}
        <Link
          href="/mypage/application"
          className="border-neutral-80 text-neutral-20 text-xsmall16 flex-1 rounded-sm border py-3 font-medium"
        >
          신청 내역 확인하기
        </Link>
      </div>
    </div>
  );
};

export default OrderFailPage;
