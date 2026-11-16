import { Suspense } from 'react';

import OrderResultPage from '@/domain/live-mentoring/order/OrderResultPage';

/**
 * Toss `successUrl` 콜백 라우트.
 * `useSearchParams` 를 쓰므로 Suspense 로 감싼다(Next 앱 라우터 요구사항).
 */
const Page = () => (
  <Suspense
    fallback={
      <p className="py-20 text-center text-neutral-40">결제를 확인하는 중…</p>
    }
  >
    <OrderResultPage />
  </Suspense>
);

export default Page;
