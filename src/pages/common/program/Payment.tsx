import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserQuery } from '../../../api/user';
import {
  PaymentMethodKey,
  paymentSearchParamsSchema,
} from '../../../data/getPaymentSearchParams';
import { searchParamsToObject } from '../../../utils/network';
import { generateRandomString } from '../../../utils/random';

type TossPaymentsWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY || '';

const Payment = () => {
  const navigate = useNavigate();
  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = paymentSearchParamsSchema.safeParse(obj);
    if (!result.success) {
      console.log(result.error);

      alert('잘못된 접근입니다.');
      navigate('/');
    }

    return result.data;
  }, []);
  const { data: user } = useUserQuery();

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodKey | null>(null);
  const tossInitialized = useRef(false);

  useEffect(() => {
    if (!user || !params) {
      return;
    }

    const init = async () => {
      if (tossInitialized.current) {
        return;
      }
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
        value: params.totalPrice,
      });

      // ------  결제 UI 렌더링 ------
      const methods = await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'widgetA',
      });

      methods.getSelectedPaymentMethod().then((paymentMethod) => {
        setSelectedPaymentMethod(paymentMethod.code as PaymentMethodKey);
      });
      methods.on('paymentMethodSelect', (paymentMethod) => {
        // TODO: as 삭제
        setSelectedPaymentMethod(paymentMethod.code as PaymentMethodKey);
      });

      // ------  이용약관 UI 렌더링 ------
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setReady(true);
    };

    init();
  }, [params, user]);

  const handleButtonClick = async () => {
    if (!widgets || !params) {
      return;
    }

    const orderId = generateRandomString();

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('paymentMethodKey', selectedPaymentMethod || '');

    try {
      await widgets.requestPayment({
        orderId,
        orderName: params.programTitle,
        successUrl:
          window.location.origin +
          `/order/${orderId}/result?${searchParams.toString()}`,
        failUrl:
          window.location.origin +
          `/order/${orderId}/fail?${searchParams.toString()}`,
        customerEmail: params.email,
        customerName: params.name,
        customerMobilePhone: params.phone.replace(/[^0-9]/g, ''),
      });
    } catch (error) {
      // 에러 처리하기
      console.error(error);
    }
  };

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl pb-6">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        <button
          className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
          disabled={!ready}
          onClick={handleButtonClick}
        >
          결제하기 {params?.totalPrice.toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default Payment;
