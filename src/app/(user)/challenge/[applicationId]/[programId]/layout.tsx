'use client';

import { CurrentChallengeProvider } from '@/context/CurrentChallengeProvider';
import ChallengeLayout from '@components/common/challenge/ui/layout/ChallengeLayout';

export default function ChallengeProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrentChallengeProvider>
      <ChallengeLayout>{children}</ChallengeLayout>
    </CurrentChallengeProvider>
  );
}
