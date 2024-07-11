import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ProgramType } from './ProgramDetail';

export interface SelectPaymentPageProps {
  programType: ProgramType;
}

const SelectPaymentPage = ({ programType }: SelectPaymentPageProps) => {
  const { programId } = useParams<{ programId: string }>();
  const state = useLocation().state;
  const numberRegex = /[^0-9]/g;

  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY || '';
  const customerKey = 'zOZ8i_RHluykZWVBsLqXp';
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: state.totalPrice,
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
      value: state.totalPrice,
    });
  }, [state.totalPrice]);

  useEffect(() => {
    if (state.totalPrice === 0 || widgets != null) {
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
  }, [clientKey, customerKey, state.totalPrice]);

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
    if (widgets == null || !state.programTitle) {
      return;
    }

    const orderId = getOrderId();

    try {
      await widgets.requestPayment({
        orderId: orderId,
        orderName: state.programTitle,
        successUrl:
          window.location.origin +
          `/program/${orderId}/success?programType=${programType}&programId=${programId}&couponId=${state.couponId}&priceId=${state.priceId}&price=${state.price}&discount=${state.discount}&couponPrice=${state.couponPrice}&contactEmail=${state.contactEmail}&question=${state.question}`,
        failUrl:
          window.location.origin +
          `/program/${orderId}/fail?programType=${programType}&programId=${programId}`,
        customerEmail: state.email,
        customerName: state.name,
        customerMobilePhone: state.phone.replace(numberRegex, ''),
      });
    } catch (error) {
      // 에러 처리하기
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        <button
          className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
          disabled={!ready}
          onClick={handleButtonClick}
        >
          결제하기 {state.totalPrice.toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default SelectPaymentPage;
