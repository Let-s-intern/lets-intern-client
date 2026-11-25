'use client';

// 토스 결제 실패·취소 화면. 토스가 failUrl 에 code, message 를 붙여 보낸다.
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buildPurchasePath, RETURN_URL_PARAM } from '../utils/purchasePath';
import GuidebookPurchaseCard from './GuidebookPurchaseCard';
import PurchaseCloseButton from './PurchaseCloseButton';

export default function GuidebookPurchaseFail({
  guidebookId,
}: {
  guidebookId: number;
}) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <GuidebookPurchaseCard title="결제 실패">
      <p className="text-xsmall14 text-neutral-30">
        {message ?? '결제가 완료되지 않았어요.'}
      </p>
      {code && <p className="text-xxsmall12 text-neutral-40">{code}</p>}
      <Link
        href={buildPurchasePath({
          guidebookId,
          returnUrl: searchParams.get(RETURN_URL_PARAM),
        })}
        className="rounded-md bg-primary px-6 py-3 text-center font-medium text-neutral-100"
      >
        다시 시도하기
      </Link>
      <PurchaseCloseButton label="닫기" />
    </GuidebookPurchaseCard>
  );
}
