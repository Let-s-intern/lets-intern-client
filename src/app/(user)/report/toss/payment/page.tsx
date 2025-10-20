'use client';

import {
  loadTossPayments,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

import { useGetParticipationInfo } from '@/api/application';
import { useGetReportDetailQuery } from '@/api/report';
import { useUserQuery } from '@/api/user';
import { PaymentMethodKey } from '@/data/getPaymentSearchParams';
import useReportApplicationStore from '@/store/useReportApplicationStore';

type TossPaymentsWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

const ReportTossPage = () => {
  const tossInitialized = useRef(false);

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [methods, setMethods] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );

  const { data: reportApplication } = useReportApplicationStore();
  const { data: user } = useUserQuery();
  const { data: reportDetail } = useGetReportDetailQuery(
    reportApplication.reportId!,
  );
  const { data: participationInfo } = useGetParticipationInfo();

  const handleButtonClick = async () => {
    if (!widgets) return;

    const paymentMethod = await methods?.getSelectedPaymentMethod();
    // TOSS 에서 넘겨받을 때 orderId가 추가로 붙어서 넘어올 수 있어 배열 케이스도 처리 TODO: 내부용 orderId 이름 변경
    const orderId = reportApplication.orderId ?? '';
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set(
      'paymentMethodKey',
      ((paymentMethod?.code as PaymentMethodKey | null | undefined) ?? null) ||
        '',
    );
    try {
      await widgets.requestPayment({
        orderId,
        orderName: reportDetail?.title ?? '',
        successUrl:
          window.location.origin +
          `/report/order/result?${searchParams.toString()}`,
        failUrl:
          window.location.origin +
          `/report/order/fail?${searchParams.toString()}`,
        customerEmail: participationInfo?.email ?? '',
        customerName: participationInfo?.name ?? '',
        customerMobilePhone: (participationInfo?.phoneNumber ?? '').replace(
          /[^0-9]/g,
          '',
        ),
      });
    } catch (error) {
      // 에러 처리하기
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      if (tossInitialized.current) return;

      tossInitialized.current = true;
      const customerKey = (user.id ?? '').slice(0, 16);
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      setWidgets(widgets);

      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount({
        currency: 'KRW',
        value: reportApplication.amount ?? 0,
      });

      // ------  결제 UI 렌더링 ------
      const methods = await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'widgetA',
      });
      setMethods(methods);

      // ------  이용약관 UI 렌더링 ------
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setReady(true);
    };

    init();
  }, [reportApplication, user]);

  return (
    <div
      className="mx-auto w-full max-w-5xl pb-6"
      data-program-text={reportDetail?.title}
    >
      {/* 결제 UI */}
      <div id="payment-method" />
      {/* 이용약관 UI */}
      <div id="agreement" />
      <div className="px-5">
        <button
          className="payment_button_click text-1.125-medium block w-full rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
          disabled={!ready}
          onClick={handleButtonClick}
        >
          결제하기 {(reportApplication.amount ?? '').toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default ReportTossPage;