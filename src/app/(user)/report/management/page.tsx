import { Suspense } from 'react';

import ReportManagementPage from '@/domain/report/ReportManagementPage';

const ReportManagementPageWithSuspense = () => (
  <Suspense fallback={null}>
    <ReportManagementPage />
  </Suspense>
);

export default ReportManagementPageWithSuspense;
