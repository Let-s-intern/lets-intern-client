import { CurrentAdminChallengeProvider } from '@/context/CurrentAdminChallengeProvider';
import ChallengeAdminLayout from '@components/admin/challenge/ui/ChallengeOperationAdminLayout';

export default function ChallengeOperationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrentAdminChallengeProvider>
      <ChallengeAdminLayout>{children}</ChallengeAdminLayout>
    </CurrentAdminChallengeProvider>
  );
}
