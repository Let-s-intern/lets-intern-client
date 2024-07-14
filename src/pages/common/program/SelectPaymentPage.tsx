import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { paymentSearchParamsSchema } from '../../../data/getPaymentSearchParams';
import { searchParamsToObject } from '../../../utils/network';
import { ProgramType } from './ProgramDetail';

export interface SelectPaymentPageProps {
  programType: ProgramType;
}

const SelectPaymentPage = ({ programType }: SelectPaymentPageProps) => {
  const { programId } = useParams<{ programId: string }>();

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = paymentSearchParamsSchema.safeParse(obj);
    if (!result.success) {
      console.log(result.error);
      throw new Error('잘못된 접근입니다.');
      // alert('잘못된 접근입니다.');
    }

    return result.data;
  }, []);

  useEffect(() => {
    console.log('params', params);
  }, [params]);

  const numberRegex = /[^0-9]/g;

  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY || '';
  // TODO: 수정
  const customerKey = 'zOZ8i_RHluykZWVBsLqXp';
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: params.totalPrice,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);

  const getRandomString = (length: number) => {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  };

  const getOrderId = () => {
    return `${programType}-${programId}-${getRandomString(8)}`;
  };

  useEffect(() => {
    setAmount({
      currency: 'KRW',
      value: params.totalPrice,
    });
  }, [params.totalPrice]);

  useEffect(() => {
    if (params.totalPrice === 0 || widgets != null) {
      return;
    }
    const fetchPaymentWidgets = async () => {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgets);
    };

    fetchPaymentWidgets();

    return () => {
      if (widgets != null) {
        setWidgets(null);
      }
    };
  }, [clientKey, customerKey, params.totalPrice]);

  useEffect(() => {
    const renderPaymentWidgets = async () => {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      // ------  결제 UI 렌더링 ------
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      // ------  이용약관 UI 렌더링 ------
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      setReady(true);
    };

    renderPaymentWidgets();
  }, [widgets, amount]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
    console.log(amount);
  }, [widgets, amount]);

  const handleButtonClick = async () => {
    if (widgets == null || !params.programTitle) {
      return;
    }

    const orderId = getOrderId();

    try {
      await widgets.requestPayment({
        orderId: orderId,
        orderName: params.programTitle,
        successUrl:
          window.location.origin +
          `/program/${orderId}/success?${new URL(window.location.href).searchParams.toString()}`,
        failUrl:
          window.location.origin +
          `/program/${orderId}/fail?${new URL(window.location.href).searchParams.toString()}`,
        customerEmail: params.email,
        customerName: params.name,
        customerMobilePhone: params.phone.replace(numberRegex, ''),
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
          결제하기 {params.totalPrice.toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default SelectPaymentPage;
