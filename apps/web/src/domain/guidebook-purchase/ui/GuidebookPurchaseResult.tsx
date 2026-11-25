'use client';

// 가이드북 구매 결과. 토스 성공 쿼리(0원이면 free 쿼리)로 신청을 만든다.
// requested 와 postDone 으로 중복 요청을 막는다. 새로고침해도 다시 신청하지 않는다.
import {
  useProgramApplicationQueryKey,
  type PostApplicationInterface,
} from '@/api/application';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { postGuidebookPurchase } from '../api';
import { buildPurchasePath, RETURN_URL_PARAM } from '../utils/purchasePath';
import GuidebookPurchaseCard from './GuidebookPurchaseCard';
import PurchaseCloseButton from './PurchaseCloseButton';

type ResultState = 'pending' | 'success' | 'fail';

const DEFAULT_ERROR_MESSAGE = '결제가 완료되지 않았어요. 다시 시도해 주세요.';

/** 토스 성공 쿼리에서 신청 본문을 만든다. 필요한 값이 빠졌으면 null 이다 */
const toApplicationBody = (
  searchParams: URLSearchParams,
): PostApplicationInterface | null => {
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const priceId = Number(searchParams.get('priceId'));
  const isFree = searchParams.get('free') === 'true';
  const paymentKey = isFree ? null : searchParams.get('paymentKey');

  if (!orderId || !amount || !Number.isFinite(priceId)) return null;
  if (isFree ? amount !== '0' : !paymentKey) return null;

  return {
    paymentInfo: { couponId: null, priceId, paymentKey, orderId, amount },
  };
};

export default function GuidebookPurchaseResult({
  guidebookId,
}: {
  guidebookId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const requested = useRef(false);
  const [state, setState] = useState<ResultState>('pending');
  const isFree = searchParams.get('free') === 'true';

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    if (searchParams.get('postDone') === 'true') {
      setState('success');
      return;
    }

    const body = toApplicationBody(searchParams);
    if (!body) {
      setState('fail');
      return;
    }

    postGuidebookPurchase(guidebookId, body)
      .then(() => {
        setState('success');
        queryClient.invalidateQueries({
          queryKey: [useProgramApplicationQueryKey],
        });
        const next = new URLSearchParams(searchParams.toString());
        next.set('postDone', 'true');
        router.replace(`${window.location.pathname}?${next}`);
      })
      .catch((error) => {
        console.error(error);
        setState('fail');
      });
  }, [guidebookId, queryClient, router, searchParams]);

  if (state === 'pending') {
    return (
      <GuidebookPurchaseCard title="결제 확인 중">
        <LoadingContainer className="py-10" />
      </GuidebookPurchaseCard>
    );
  }

  if (state === 'fail') {
    return (
      <GuidebookPurchaseCard title="결제 실패">
        <p className="text-xsmall14 text-neutral-30">{DEFAULT_ERROR_MESSAGE}</p>
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

  return (
    <GuidebookPurchaseCard
      title={isFree ? '신청이 완료되었어요' : '결제가 완료되었어요'}
    >
      <p className="text-xsmall14 text-neutral-30">
        구매한 가이드북은 렛츠커리어 마이페이지에서 볼 수 있어요.
      </p>
      <PurchaseCloseButton label="확인" />
    </GuidebookPurchaseCard>
  );
}
