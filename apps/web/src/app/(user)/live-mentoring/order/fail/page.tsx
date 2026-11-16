import { Suspense } from 'react';

import OrderFailPage from '@/domain/live-mentoring/order/OrderFailPage';

/** Toss `failUrl` 콜백 라우트. */
const Page = () => (
  <Suspense fallback={<p className="py-20 text-center text-neutral-40">…</p>}>
    <OrderFailPage />
  </Suspense>
);

export default Page;
