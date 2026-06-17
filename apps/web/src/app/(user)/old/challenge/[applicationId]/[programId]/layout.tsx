'use client';

import { OldCurrentChallengeProvider } from '@/context/OldCurrentChallengeProvider';
import OldChallengeLayout from '@/domain/challenge/old/OldChallengeLayout';

export default function OldChallengeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OldCurrentChallengeProvider>
      <OldChallengeLayout>{children}</OldChallengeLayout>
    </OldCurrentChallengeProvider>
  );
}
