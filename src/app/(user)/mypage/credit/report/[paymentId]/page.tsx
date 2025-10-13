import { Suspense } from 'react';

import ReportCreditDetailPage from '@/components/pages/mypage/credit/ReportCreditDetailPage';

const ReportCreditDetailPageWithSuspense = () => (
  <Suspense fallback={null}>
    <ReportCreditDetailPage />
  </Suspense>
);

export default ReportCreditDetailPageWithSuspense;
