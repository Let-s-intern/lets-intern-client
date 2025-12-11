import { Suspense } from 'react';

import ReportCreditDetailPage from '@/domain/mypage/mypage/credit/ReportCreditDetailPage';

const ReportCreditDetailPageWithSuspense = () => (
  <Suspense fallback={null}>
    <ReportCreditDetailPage />
  </Suspense>
);

export default ReportCreditDetailPageWithSuspense;
