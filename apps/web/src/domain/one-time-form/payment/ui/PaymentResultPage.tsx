'use client';

import FormPopupShell from '../../ui/FormPopupShell';
import usePaymentResult from '../hooks/usePaymentResult';
import type { PaymentResultQuery } from '../utils/paymentResult';

interface PaymentResultPageProps {
  slug: string;
  /** 토스 successUrl 쿼리. 없거나 형식이 다르면 null */
  query: PaymentResultQuery | null;
}

/** 토스 성공 리다이렉트(계약 11.1). 신청을 만드는 동안 안내만 보이고 결과에 따라 이동한다 */
const PaymentResultPage = ({ slug, query }: PaymentResultPageProps) => {
  usePaymentResult(slug, query);

  return (
    <FormPopupShell title="결제하기">
      <p
        role="status"
        className="text-xsmall14 text-neutral-40 py-10 text-center"
      >
        결제를 확인하고 있어요
      </p>
    </FormPopupShell>
  );
};

export default PaymentResultPage;
