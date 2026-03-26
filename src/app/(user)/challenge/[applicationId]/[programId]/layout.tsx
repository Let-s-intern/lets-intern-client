'use client';

import { CurrentChallengeProvider } from '@/context/CurrentChallengeProvider';
import ChallengeLayout from '@/domain/challenge/ui/layout/ChallengeLayout';

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
