import { Outlet } from 'react-router-dom';
import ChallengeAdminLayout from '@/pages/challenge/ui/ChallengeOperationAdminLayout';
import { CurrentAdminChallengeProvider } from '@/context/CurrentAdminChallengeProvider';

const ChallengeOperationLayout = () => (
  <CurrentAdminChallengeProvider>
    <ChallengeAdminLayout>
      <Outlet />
    </ChallengeAdminLayout>
  </CurrentAdminChallengeProvider>
);

export default ChallengeOperationLayout;
