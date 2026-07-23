import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import ReportManagementPage from '@/domain/report/ReportManagementPage';

const ReportManagementPageWithSuspense = () => (
  <AsyncBoundary>
    <ReportManagementPage />
  </AsyncBoundary>
);

export default ReportManagementPageWithSuspense;
