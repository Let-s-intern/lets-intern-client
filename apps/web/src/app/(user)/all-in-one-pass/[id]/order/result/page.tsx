'use client';

// 올인원패스 결제 결과 — 스토어+토스 쿼리로 신청 생성 POST 후 성공/실패 표시. postDone으로 중복 POST 방지.

import { PostApplicationResult } from '@/api/application';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import {
  postMembershipApplication,
  postMembershipExtension,
} from '@/domain/all-in-one-pass/api/purchase';
import dayjs from '@/lib/dayjs';
import useMembershipOrderStore from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import { buildMembershipApplicationBody } from '@/domain/all-in-one-pass/utils/vodPassOrder';
import DescriptionBox from '@/domain/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '@/domain/program/paymentSuccess/PaymentInfoRow';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ResultState = 'pending' | 'success' | 'fail';

const MembershipOrderResult = () => {
  const params = useParams<{ id: string }>();
  const membershipId = Number(params.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = useRef(false);
  const [state, setState] = useState<ResultState>('pending');
  const [result, setResult] = useState<PostApplicationResult | null>(null);

  const { data, _hasHydrated } = useMembershipOrderStore();

  useEffect(() => {
    if (!_hasHydrated || requested.current) return;
    requested.current = true;

    if (searchParams.get('postDone') === 'true') {
      setState('success');
      return;
    }

    // 토스 실패(failUrl에 code 붙음)
    if (searchParams.get('code')) {
      setState('fail');
      return;
    }

    const orderId = searchParams.get('orderId') ?? data.orderId;
    const amount = searchParams.get('amount') ?? String(data.totalPrice ?? 0);
    const paymentKey = data.isFree ? null : searchParams.get('paymentKey');

    const request =
      data.orderType === 'EXTENSION'
        ? data.applicationId && data.membershipOptionId && orderId
          ? postMembershipExtension(data.applicationId, {
              membershipOptionId: data.membershipOptionId,
              couponCode: data.couponCode,
              paymentKey,
              orderId,
              amount,
            })
          : null
        : data.membershipPlanId && orderId
          ? postMembershipApplication(
              membershipId,
              buildMembershipApplicationBody(data, {
                orderId,
                paymentKey: searchParams.get('paymentKey'),
              }),
            )
          : null;

    if (!request) {
      setState('fail');
      return;
    }

    request
      .then((res) => {
        setResult(res.data.data);
        setState('success');
        const next = new URLSearchParams(searchParams.toString());
        next.set('postDone', 'true');
        router.replace(`${window.location.pathname}?${next.toString()}`);
      })
      .catch((e) => {
        console.error(e);
        setState('fail');
      });
  }, [_hasHydrated, membershipId, router, searchParams, data]);

  const isSuccess = state === 'success';
  const price = data.price ?? 0;
  const discount = data.discount ?? 0;
  const discountPercent =
    price === 0 ? 0 : Math.floor((discount / price) * 100);
  const paidAmount = Number(
    searchParams.get('amount') ?? String(data.totalPrice ?? 0),
  );

  if (state === 'pending') {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        <div className="text-neutral-20">결제 확인 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-small20 text-neutral-0 flex w-full items-center justify-start py-6 font-bold">
          결제 확인하기
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <DescriptionBox type={isSuccess ? 'SUCCESS' : 'FAIL'} />
          <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
            <div className="flex w-full flex-col items-start justify-center gap-6">
              <div className="text-xsmall16 text-neutral-0 font-semibold">
                결제 상품
              </div>
              <div className="border-neutral-80 w-full rounded-md border p-4">
                <p className="text-small16 text-neutral-0 font-semibold">
                  {data.passTitle ?? '올인원패스'}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col justify-center gap-6">
              <div className="text-neutral-0 font-semibold">결제 상세</div>
              <div className="bg-neutral-90 flex w-full items-center justify-between gap-x-4 px-3 py-5">
                <div className="font-bold">총 결제금액</div>
                <div className="font-bold">{paidAmount.toLocaleString()}원</div>
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                <PaymentInfoRow
                  title="참여비용"
                  content={`${price.toLocaleString()}원`}
                />
                <PaymentInfoRow
                  title={`할인 (${discountPercent}%)`}
                  content={`-${discount.toLocaleString()}원`}
                />
              </div>
              <hr className="border-neutral-85" />
              {isSuccess && result?.tossInfo && (
                <div className="flex w-full flex-col items-center justify-center">
                  <PaymentInfoRow
                    title="결제일자"
                    content={dayjs(result.tossInfo.approvedAt).format(
                      'YYYY.MM.DD(ddd) HH:mm',
                    )}
                  />
                  <PaymentInfoRow
                    title="결제수단"
                    content={result.tossInfo.method ?? ''}
                  />
                  <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                    <div className="text-neutral-40">영수증</div>
                    <div className="text-neutral-0 flex grow items-center justify-end">
                      <Link
                        href={result.tossInfo.receipt?.url ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="border-neutral-60 flex items-center justify-center rounded-sm border bg-white px-3 py-2 text-sm font-medium"
                      >
                        영수증 보기
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {isSuccess ? (
                <Link
                  href="/mypage/application"
                  className="mypage_button border-primary bg-primary flex w-full justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100"
                >
                  마이페이지 바로가기
                </Link>
              ) : (
                <Link
                  href={`/all-in-one-pass/${membershipId}/payment-input`}
                  className="border-primary bg-primary flex w-full justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100"
                >
                  다시 결제하기
                </Link>
              )}
              <Link
                href={`/all-in-one-pass/${membershipId}`}
                className="text-neutral-40 flex w-full justify-center py-2 text-sm font-medium"
              >
                패스 소개로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MembershipOrderResultPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <MembershipOrderResult />
    </AsyncBoundary>
  );
}
