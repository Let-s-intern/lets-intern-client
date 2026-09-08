'use client';

import {
  loadTossPayments,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useUserQuery } from '@/api/user/user';
import { formatPrice } from '../constants';
import { useOrderDraftStore } from './hooks/useOrderDraft';

type TossPaymentsWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

/**
 * 1대1 라이브 멘토링 Toss 결제 위젯 (PRD 7-4 안 A).
 *
 * `app/(user)/payment/page.tsx` 의 위젯 연동을 복제했다. 원본은 `useProgramStore` 의
 * `programId` + `programType` 을 읽는데 라이브 멘토링은 `openingId` + `applicationId`
 * 체계라 그 스토어에 얹을 수 없다. 스토어를 늘리면 프로그램·리포트 결제가 함께
 * 흔들려 전용 경로를 따로 뒀다.
 *
 * 금액은 **서버가 만든 신청의 `finalAmount`** 를 그대로 쓴다. 화면에서 다시 계산하면
 * 쿠폰이 붙었을 때 결제창 금액과 서버 승인 금액이 어긋나 승인이 실패한다.
 */
const OrderPaymentPage = () => {
  const router = useRouter();
  const application = useOrderDraftStore((state) => state.application);
  const draft = useOrderDraftStore((state) => state.draft);
  const { data: user } = useUserQuery();

  const [isReady, setIsReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [methods, setMethods] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );
  const tossInitialized = useRef(false);

  // 신청 없이 닿는 경로는 새로고침뿐이다. 결제할 대상이 없으므로 되돌려보낸다.
  useEffect(() => {
    if (application) return;
    router.replace(
      draft ? `/live-mentoring/${draft.mentorId}` : '/live-mentoring',
    );
  }, [application, draft, router]);

  useEffect(() => {
    if (!application || !user || tossInitialized.current) return;
    tossInitialized.current = true;

    const init = async () => {
      const customerKey = (user.id ?? '').slice(0, 16);
      const tossPayments = await loadTossPayments(clientKey);
      const created = tossPayments.widgets({ customerKey });
      setWidgets(created);

      await created.setAmount({
        currency: 'KRW',
        value: application.finalAmount,
      });
      setMethods(
        await created.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'widgetA',
        }),
      );
      await created.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setIsReady(true);
    };

    init();
  }, [application, user]);

  const handlePayClick = async () => {
    if (!widgets || !application) return;

    const paymentMethod = await methods?.getSelectedPaymentMethod();
    const searchParams = new URLSearchParams();
    searchParams.set('paymentMethodKey', paymentMethod?.code ?? '');

    try {
      await widgets.requestPayment({
        orderId: application.orderId,
        orderName: application.orderName,
        successUrl: `${window.location.origin}/live-mentoring/order/result?${searchParams.toString()}`,
        failUrl: `${window.location.origin}/live-mentoring/order/fail?${searchParams.toString()}`,
        customerEmail: application.customerEmail,
        customerName: application.customerName,
        customerMobilePhone: application.customerMobilePhone,
      });
    } catch (error) {
      // 사용자가 결제창을 닫은 경우도 여기로 온다. 화면은 그대로 두고 다시 누르게 한다.
      console.error(error);
    }
  };

  if (!application) {
    return <p className="text-neutral-40 py-20 text-center">이동 중…</p>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-10 pt-6">
      <h1 className="text-small20 text-neutral-0 mb-4 font-bold">결제</h1>

      <div id="payment-method" />
      <div id="agreement" />

      <button
        type="button"
        disabled={!isReady}
        onClick={handlePayClick}
        className="bg-primary text-xsmall16 disabled:bg-neutral-80 disabled:text-neutral-40 w-full rounded-sm py-4 font-medium text-white"
      >
        {formatPrice(application.finalAmount)} 결제하기
      </button>
    </div>
  );
};

export default OrderPaymentPage;
