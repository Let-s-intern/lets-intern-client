'use client';

// VOD 이용권 단독 구매 결과. 토스 결과 쿼리로 구매를 만든다. postDone 으로 중복 요청을 막는다.
import LoadingContainer from '@/common/loading/LoadingContainer';
import dayjs from '@/lib/dayjs';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { postVodPassPurchase } from '../api';
import VodPassPurchaseCard from './VodPassPurchaseCard';

type ResultState = 'pending' | 'success' | 'fail';

const ORDER_ERROR_MESSAGES: Record<string, string> = {
  VOD_PASS_PRODUCT_CHANGED: 'VOD 이용권 가격·기간이 변경되었어요.',
  VOD_PASS_PRODUCT_NOT_FOUND: 'VOD 이용권 상품을 찾을 수 없어요.',
  VOD_PASS_SALE_NOT_ENABLED: 'VOD 이용권 판매가 종료되었어요.',
  VOD_PASS_PURCHASE_MONTHS_EXCEEDED: '구매할 수 있는 기간을 넘었어요.',
  VOD_PASS_TOTAL_MONTHS_EXCEEDED: '보유할 수 있는 기간을 넘었어요.',
};

const DEFAULT_ERROR_MESSAGE = '결제가 완료되지 않았어요. 다시 시도해 주세요.';

const toErrorMessage = (error: unknown) => {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === 'string'
    ? (ORDER_ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE)
    : DEFAULT_ERROR_MESSAGE;
};

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

export default function VodPassPurchaseResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const requested = useRef(false);
  const [state, setState] = useState<ResultState>('pending');
  const [message, setMessage] = useState(DEFAULT_ERROR_MESSAGE);
  const [period, setPeriod] = useState<string | null>(null);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    if (searchParams.get('postDone') === 'true') {
      setState('success');
      return;
    }

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    if (searchParams.get('code') || !paymentKey || !orderId || !amount) {
      setState('fail');
      return;
    }

    postVodPassPurchase({
      vodPassProductId: Number(searchParams.get('productId')),
      vodPassMonths: Number(searchParams.get('months')),
      vodPassExpectedPrice: Number(searchParams.get('expectedPrice')),
      vodPassExpectedDurationDays: Number(
        searchParams.get('expectedDurationDays'),
      ),
      paymentKey,
      orderId,
      amount,
    })
      .then((res) => {
        const vodPass = res.data.data.vodPass;
        if (vodPass?.startsAt && vodPass.endsAt) {
          setPeriod(
            `${formatDate(vodPass.startsAt)} ~ ${formatDate(vodPass.endsAt)}`,
          );
        }
        setState('success');
        queryClient.invalidateQueries({
          queryKey: ['standaloneVodPassProduct'],
        });
        const next = new URLSearchParams(searchParams.toString());
        next.set('postDone', 'true');
        router.replace(`${window.location.pathname}?${next}`);
      })
      .catch((error) => {
        console.error(error);
        setMessage(toErrorMessage(error));
        setState('fail');
      });
  }, [queryClient, router, searchParams]);

  if (state === 'pending') {
    return (
      <VodPassPurchaseCard title="결제 확인 중">
        <LoadingContainer className="py-10" />
      </VodPassPurchaseCard>
    );
  }

  if (state === 'fail') {
    return (
      <VodPassPurchaseCard title="결제 실패">
        <p className="text-xsmall14 text-neutral-30">{message}</p>
        <Link
          href="/vod-pass/purchase"
          className="bg-primary rounded-md px-6 py-3 text-center font-medium text-neutral-100"
        >
          다시 시도하기
        </Link>
      </VodPassPurchaseCard>
    );
  }

  return (
    <VodPassPurchaseCard title="결제가 완료되었어요">
      {period && (
        <p className="text-xsmall14 text-neutral-10">이용 기간 {period}</p>
      )}
      <a
        href="https://seminar-vod.letscareer.co.kr/login"
        className="bg-primary rounded-md px-6 py-3 text-center font-medium text-neutral-100"
      >
        VOD 보러가기
      </a>
    </VodPassPurchaseCard>
  );
}
