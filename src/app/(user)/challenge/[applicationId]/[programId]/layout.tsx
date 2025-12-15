'use client';

import ChallengeLayout from '@/common/challenge/ui/layout/ChallengeLayout';
import { CurrentChallengeProvider } from '@/context/CurrentChallengeProvider';

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
