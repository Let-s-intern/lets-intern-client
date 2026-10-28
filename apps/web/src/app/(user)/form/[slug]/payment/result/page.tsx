import PaymentResultPage from '@/domain/one-time-form/payment/ui/PaymentResultPage';
import { parsePaymentResultQuery } from '@/domain/one-time-form/payment/utils/paymentResult';

// slug 검사는 상위 layout 이 한다. 토스 successUrl 로 paymentKey·orderId·amount 가 붙어 온다(계약 11.2-10)
const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    paymentKey?: string | string[];
    orderId?: string | string[];
    amount?: string | string[];
  }>;
}) => {
  const { slug } = await params;
  const query = parsePaymentResultQuery(await searchParams);

  return <PaymentResultPage slug={slug} query={query} />;
};

export default Page;
