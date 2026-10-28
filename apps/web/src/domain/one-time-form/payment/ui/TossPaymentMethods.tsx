import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

export type TossPaymentsWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

const PAYMENT_METHOD_ELEMENT_ID = 'one-time-form-payment-method';

interface TossPaymentMethodsProps {
  amount: number;
  /** 회원 결제 키. `app/(user)/payment/page.tsx` 와 같이 유저 id 앞 16자 */
  customerKey: string;
  /** 결제 수단을 그리고 나면 부른다. 결제 버튼이 이 위젯으로 requestPayment 를 부른다 */
  onReady: (widgets: TossPaymentsWidgets) => void;
}

/**
 * 토스 결제 위젯의 결제 수단 영역. 기존 결제 화면과 같은 SDK·클라이언트 키·variantKey 를 쓴다.
 * 약관 동의는 시안의 동의 3종이 대신하므로 위젯 약관(renderAgreement)은 그리지 않는다.
 */
const TossPaymentMethods = ({
  amount,
  customerKey,
  onReady,
}: TossPaymentMethodsProps) => {
  const [hasError, setHasError] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // 개발 모드 StrictMode 의 이중 실행에서 위젯을 두 번 그리지 않는다
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        await widgets.setAmount({ currency: 'KRW', value: amount });
        await widgets.renderPaymentMethods({
          selector: `#${PAYMENT_METHOD_ELEMENT_ID}`,
          variantKey: 'widgetA',
        });
        onReady(widgets);
      } catch (error) {
        console.error(error);
        setHasError(true);
      }
    };

    init();
  }, [amount, customerKey, onReady]);

  return (
    <>
      <div id={PAYMENT_METHOD_ELEMENT_ID} />
      {hasError ? (
        <p role="alert" className="text-xsmall14 text-requirement mt-2">
          결제 수단을 불러오지 못했어요. 창을 새로고침해 주세요.
        </p>
      ) : null}
    </>
  );
};

export default TossPaymentMethods;
