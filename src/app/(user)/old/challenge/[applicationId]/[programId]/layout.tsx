'use client';

import OldChallengeLayout from '@/common/challenge/ui/layout/OldChallengeLayout';
import { OldCurrentChallengeProvider } from '@/context/OldCurrentChallengeProvider';

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
