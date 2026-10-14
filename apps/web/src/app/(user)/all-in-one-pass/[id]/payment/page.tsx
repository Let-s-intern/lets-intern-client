'use client';

// 올인원패스 토스 결제 화면 — 스토어 금액·주문정보로 위젯 표시, 성공 시 order/result로.

import { useUserQuery } from '@/api/user/user';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useMembershipOrderStore from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import {
  loadTossPayments,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

type TossWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const MembershipPayment = () => {
  const params = useParams<{ id: string }>();
  const membershipId = Number(params.id);
  const router = useRouter();

  const { data, checkInvalidate } = useMembershipOrderStore();

  if (checkInvalidate() && typeof window !== 'undefined') {
    window.alert('잘못된 접근입니다.');
    router.push('/');
  }

  const { data: user } = useUserQuery();

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossWidgets | null>(null);
  const [methods, setMethods] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );
  const tossInitialized = useRef(false);

  const totalPrice = data.totalPrice ?? 0;

  useEffect(() => {
    if (!user || tossInitialized.current) return;
    tossInitialized.current = true;
    (async () => {
      const customerKey = (user.id ?? '').slice(0, 16);
      const tossPayments = await loadTossPayments(clientKey);
      const w = tossPayments.widgets({ customerKey });
      setWidgets(w);
      await w.setAmount({ currency: 'KRW', value: totalPrice });
      const m = await w.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'widgetA',
      });
      setMethods(m);
      await w.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleButtonClick = async () => {
    if (!widgets) return;
    const paymentMethod = await methods?.getSelectedPaymentMethod();
    const resultBase = `/all-in-one-pass/${membershipId}/order/result`;
    const searchParams = new URLSearchParams();
    if (paymentMethod?.code)
      searchParams.set('paymentMethodKey', paymentMethod.code);

    try {
      await widgets.requestPayment({
        orderId: data.orderId ?? '',
        orderName: data.passTitle ?? '올인원패스',
        successUrl: `${window.location.origin}${resultBase}?${searchParams.toString()}`,
        failUrl: `${window.location.origin}${resultBase}?${searchParams.toString()}`,
        customerEmail: data.email ?? '',
        customerName: data.name ?? '',
        customerMobilePhone: (data.phone ?? '').replace(/[^0-9]/g, ''),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-6">
      <div id="payment-method" />
      <div id="agreement" />
      <div className="px-5">
        <button
          className="payment_button text-1.125-medium bg-primary block w-full rounded-md px-6 py-3 font-medium text-neutral-100"
          disabled={!ready}
          onClick={handleButtonClick}
        >
          결제하기 {totalPrice.toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default function MembershipPaymentPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <MembershipPayment />
    </AsyncBoundary>
  );
}
