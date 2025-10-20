import { Suspense } from 'react';

import ReportManagementPage from '@/components/pages/report/ReportManagementPage';

const ReportManagementPageWithSuspense = () => (
  <Suspense fallback={null}>
    <ReportManagementPage />
  </Suspense>
);

export default ReportManagementPageWithSuspense;
