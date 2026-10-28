import type { OneTimeFormInfo } from '@/api/one-time-form/oneTimeFormSchema';
import type { OneTimeFormDraft } from '../../utils/applicationDraft';

interface BuildTossPaymentRequestParams {
  origin: string;
  slug: string;
  form: OneTimeFormInfo;
  draft: OneTimeFormDraft;
  orderId: string;
}

/** 토스 위젯 requestPayment 인자(계약 11.3). 금액은 위젯 setAmount 로 따로 넣는다 */
export const buildTossPaymentRequest = ({
  origin,
  slug,
  form,
  draft,
  orderId,
}: BuildTossPaymentRequestParams) => ({
  orderId,
  orderName: form.paymentProductName ?? form.title,
  successUrl: `${origin}/form/${slug}/payment/result`,
  failUrl: `${origin}/form/${slug}/payment`,
  customerName: draft.name,
  customerEmail: draft.email,
  customerMobilePhone: draft.phoneNum.replace(/[^0-9]/g, ''),
});
