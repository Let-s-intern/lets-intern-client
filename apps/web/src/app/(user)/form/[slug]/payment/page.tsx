import PaymentStepPage from '@/domain/one-time-form/payment/ui/PaymentStepPage';

// slug 검사는 상위 layout 이 한다. 토스 failUrl 로 돌아오면 code·message 쿼리가 붙는다(계약 11.2-11)
const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    code?: string | string[];
    message?: string | string[];
  }>;
}) => {
  const { slug } = await params;
  const { code, message } = await searchParams;
  const failureText = typeof message === 'string' ? message : '';
  const tossFailureMessage = code ? failureText : null;

  return (
    <PaymentStepPage slug={slug} tossFailureMessage={tossFailureMessage} />
  );
};

export default Page;
